const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const SECRET_KEY = "text"
const User = require('../models/user');
const Token = require('../models/token');
const authMiddleware = require('../middleware/auth');


//curd operation
router.post('/adduser', async (req, res) => {
    try {
        const newuser = new User({
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            password: await bcryptjs.hash(req.body.password, 12)
        });

        const saveUser = await newuser.save()
        res.json(saveUser);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 'error': error.message })
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

    try {
        const login = await User.findOne({ user_email });

        if (!login) {
            return res.json({ sts: 1, msg: "Email not found" });
        }

        const isMatch = await bcryptjs.compare(password, login.password);
        if (!isMatch) {
            return res.json({ sts: 2, msg: "Password is wrong" });
        }

        const token = jwt.sign({ userId: login._id }, SECRET_KEY, {
            expiresIn: "1h",
        });

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
        res.status(500).json({ sts: 3, msg: "Internal server error", debug: error.message });
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
        const user = await User.findById(req.user.userId);
        if (!user) return res.json({ sts: 1, msg: "User not found" });
        
        user.profile_pic = profile_pic;
        await user.save();
        res.json({ sts: 0, msg: "Profile picture updated successfully", profile_pic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ sts: 1, msg: "Internal server error" });
    }
});

module.exports = router;