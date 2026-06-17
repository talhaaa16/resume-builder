const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Resume = require('../models/resume');
const PageVisit = require('../models/pageVisit');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_dev_secret_123';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

const adminAuth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ sts: 1, msg: 'No admin token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ sts: 1, msg: 'Not an admin' });
        next();
    } catch {
        res.status(401).json({ sts: 1, msg: 'Invalid admin token' });
    }
};

router.post('/login', (req, res) => {
    const { password } = req.body;
    if (!password || password !== ADMIN_SECRET) {
        return res.status(401).json({ sts: 1, msg: 'Invalid admin password' });
    }
    const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ sts: 0, token });
});

router.post('/track', async (req, res) => {
    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || req.socket.remoteAddress
            || 'unknown';

        await PageVisit.findOneAndUpdate(
            { date: todayStr },
            {
                $inc: { count: 1 },
                $addToSet: { uniqueIPs: ip }
            },
            { upsert: true }
        );
        res.status(200).json({ ok: true });
    } catch {
        res.status(200).json({ ok: false });
    }
});

router.get('/stats', adminAuth, async (req, res) => {
    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

        // ── User stats ──
        const totalUsers = await User.countDocuments();
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ _id: { $gte: objectIdFromDate(todayStart) } });
        const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ _id: { $gte: objectIdFromDate(weekStart) } });

        // ── Resume stats ──
        const totalResumes = await Resume.countDocuments();

        // ── ATS stats ──
        const totalAtsChecks = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$atsUsageCount' } } }
        ]);
        const atsChecksTotal = totalAtsChecks[0]?.total || 0;

        // ── Visit stats (last 7 days) ──
        const visits = await PageVisit.find({
            date: { $gte: sevenDaysAgoStr }
        }).sort({ date: 1 });

        const todayVisit = visits.find(v => v.date === todayStr);
        const todayVisitors = todayVisit?.uniqueIPs?.length || 0;
        const todayPageViews = todayVisit?.count || 0;
        const totalPageViews = visits.reduce((sum, v) => sum + v.count, 0);
        const totalUniqueVisitors = visits.reduce((sum, v) => sum + (v.uniqueIPs?.length || 0), 0);

        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
            const dayVisit = visits.find(v => v.date === dateStr);
            chartData.push({
                date: dateStr,
                label: dayLabel,
                pageViews: dayVisit?.count || 0,
                uniqueVisitors: dayVisit?.uniqueIPs?.length || 0
            });
        }

        const recentUsers = await User.find()
            .sort({ _id: -1 })
            .limit(10)
            .select('user_name user_email aiUsageCount atsUsageCount _id');

        res.json({
            sts: 0,
            stats: {
                users: { total: totalUsers, today: newUsersToday, thisWeek: newUsersThisWeek },
                resumes: { total: totalResumes },
                ats: { total: atsChecksTotal },
                visits: { today: todayVisitors, todayPageViews, totalPageViews, totalUniqueVisitors },
                chartData,
                recentUsers
            }
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ sts: 1, msg: 'Failed to fetch stats' });
    }
});

function objectIdFromDate(date) {
    const { Types } = require('mongoose');
    return new Types.ObjectId(Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000');
}

module.exports = router;
