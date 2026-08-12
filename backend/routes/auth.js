const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const axios = require('axios')

const SECRET_KEY = process.env.JWT_SECRET || "fallback_dev_secret";
const User = require('../models/user');
const Token = require('../models/token');
const authMiddleware = require('../middleware/auth');

const loginAttempts = new Map();


router.post('/adduser', async (req, res) => {
    try {
        const { user_email, password } = req.body;

        const existingUser = await User.findOne({ user_email });
        if (existingUser) {
            return res.status(400).json({ sts: 1, msg: "Email is already registered. Please login." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                sts: 1,
                msg: "Password too weak! (Min 6 chars, A-z, 0-9)"
            });
        }

        const newuser = new User({
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            password: await bcryptjs.hash(req.body.password, 12)
        });

        const saveUser = await newuser.save()
        res.json(saveUser);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.post('/logout', async (req, res) => {
    const token = req.body.token;
    try {
        const logout = await Token.findOneAndDelete({ token });
        if (!logout) {
            return res.json({ logoutsts: 1 });
        } else {
            return res.json({ logoutsts: 0 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/userlogin', async (req, res) => {
    const { user_email, password } = req.body;
    const ip = req.ip, now = Date.now();
    const attempts = (loginAttempts.get(ip) || []).filter(t => now - t < 900000);
    if (attempts.length >= 15) return res.status(429).json({ sts: 4, msg: 'Too many attempts' });

    try {
        const login = await User.findOne({ user_email });
        if (!login || !(await bcryptjs.compare(password, login.password))) {
            attempts.push(now);
            loginAttempts.set(ip, attempts);
            return res.json({ sts: 1, msg: 'Invalid credentials' });
        }
        loginAttempts.delete(ip);

        const token = jwt.sign({ userId: login._id }, SECRET_KEY, {
            expiresIn: "7d",
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await new Token({
            userId: login._id,
            token: token,
            expiresAt: expiresAt.toISOString()
        }).save();

        return res.json({
            sts: 0,
            msg: "Login success",
            user: {
                user_name: login.user_name,
                user_email: login.user_email,
                profile_pic: login.profile_pic,
            },
            token,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ sts: 3, msg: "Internal server error" });
    }
});


router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.json({ sts: 1, msg: "User not found" });

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) return res.json({ sts: 1, msg: "Current password is wrong" });

        user.password = await bcryptjs.hash(newPassword, 12);
        await user.save();
        res.json({ sts: 0, msg: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sts: 1, msg: "Internal server error" });
    }
});

router.post('/update-profile-pic', authMiddleware, async (req, res) => {
    try {
        const { profile_pic } = req.body;

        if (!profile_pic) {
            return res.status(400).json({ sts: 1, msg: "No image provided" });
        }

        if (!profile_pic.startsWith('data:image/')) {
            return res.status(400).json({ sts: 1, msg: "Invalid file format. Please upload a valid image." });
        }

        const sizeInBytes = (profile_pic.length * (3 / 4));
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 5) {
            return res.status(400).json({ sts: 1, msg: "File too large! Maximum limit is 5MB." });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found" });

        user.profile_pic = profile_pic;
        await user.save();
        res.json({ sts: 0, msg: "Profile picture updated successfully", profile_pic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sts: 1, msg: "Internal server error" });
    }
});

router.post('/update-profile', authMiddleware, async (req, res) => {
    try {
        const { user_name, user_email } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found" });

        if (user_name) {
            user.user_name = user_name;
        }

        if (user_email && user_email !== user.user_email) {
            const emailExists = await User.findOne({ user_email });
            if (emailExists) {
                return res.json({ sts: 1, msg: "Email is already taken by another user" });
            }
            user.user_email = user_email;
        }

        await user.save();
        res.json({
            sts: 0,
            msg: "Profile updated successfully",
            user: {
                user_name: user.user_name,
                user_email: user.user_email,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sts: 1, msg: "Internal server error" });
    }
});

// ── Dashboard stats ─────────────────────────────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const Resume = require('../models/resume');
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found" });

        // Check if ATS count should reset (new day)
        const today = new Date().toISOString().split('T')[0];
        const atsToday = user.atsLastResetDate === today ? user.atsUsageCount : 0;

        // Fetch resume stats
        const resumes = await Resume.find({ userId: req.user.userId })
            .select('personalInfo template themeColor isPublic shareId createdAt')
            .sort({ createdAt: -1 });

        res.json({
            sts: 0,
            profile: {
                name: user.user_name,
                email: user.user_email,
                avatar: user.profile_pic,
                memberSince: user._id.getTimestamp()
            },
            usage: {
                aiUsed: user.aiUsageCount,
                aiLimit: 3,
                atsToday,
                atsLimit: 2,
            },
            resumes
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ sts: 1, msg: "Internal server error" });
    }
});

router.post('/linkedin', async (req, res) => {
    try {
        const { code, redirectUri } = req.body;
        if (!code) return res.status(400).json({ sts: 1, msg: "Authorization code missing" });

        // 1. Exchange auth code for access token
        const tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: redirectUri
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = tokenRes.data;

        // 2. Fetch user profile via OpenID connect
        const userRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { name, email, picture } = userRes.data;
        if (!email) return res.status(400).json({ sts: 1, msg: "Could not fetch email from LinkedIn" });

        // 3. Find or Create User
        let user = await User.findOne({ user_email: email });
        let isNew = false;
        if (!user) {
            isNew = true;
            // Generate random password for OAuth users since it's required in schema
            const randomPassword = Math.random().toString(36).slice(-10) + "A1!"; 
            user = new User({
                user_name: name,
                user_email: email,
                password: await bcryptjs.hash(randomPassword, 12),
                avatar: picture // Ensure frontend checks this or store it properly
            });
            await user.save();
        } else if (picture && !user.avatar) {
            // Optionally update avatar if missing
            user.avatar = picture;
            await user.save();
        }

        // 4. Generate Session Token
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.user_email },
            SECRET_KEY,
            { expiresIn: '7d' } // Changed to 7d to match normal login
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newToken = new Token({ 
            userId: user._id,
            token: jwtToken,
            expiresAt: expiresAt.toISOString()
        });
        await newToken.save();

        res.json({
            sts: 0,
            msg: isNew ? "Account created successfully" : "Logged in successfully",
            token: jwtToken,
            uname: user.user_name,
            uemail: user.user_email,
            uprofilepic: user.avatar || null
        });

    } catch (error) {
        console.error("LinkedIn Auth Error:", error.response?.data || error.message);
        res.status(500).json({ sts: 1, msg: "LinkedIn authentication failed" });
    }
});

module.exports = router;