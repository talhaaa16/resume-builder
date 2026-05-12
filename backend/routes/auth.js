const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

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
    if (attempts.length >= 5) return res.status(429).json({ sts: 4, msg: 'Too many attempts' });

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

module.exports = router;