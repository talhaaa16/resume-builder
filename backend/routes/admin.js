const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Resume = require('../models/resume');
const PageVisit = require('../models/pageVisit');
const ChatConversation = require('../models/chatConversation');
const ChatMessage = require('../models/chatMessage');
const InterviewPrep = require('../models/interviewPrep');

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

// ── Overall Dashboard Statistics ──────────────────────────────────────────────
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

        // User stats
        const totalUsers = await User.countDocuments();
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ _id: { $gte: objectIdFromDate(todayStart) } });
        const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ _id: { $gte: objectIdFromDate(weekStart) } });

        // Resume stats
        const totalResumes = await Resume.countDocuments();

        // Platform usage aggregates
        const [userAggregates, totalConversations, totalMessages, totalInterviewPrepDocs] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAts: { $sum: '$atsUsageCount' },
                        totalAi: { $sum: '$aiUsageCount' },
                        totalInterviewPrep: { $sum: '$interviewPrepCount' },
                        totalJobMatch: { $sum: '$jobMatchCount' },
                        totalChat: { $sum: '$chatCount' }
                    }
                }
            ]),
            ChatConversation.countDocuments(),
            ChatMessage.countDocuments(),
            InterviewPrep.countDocuments()
        ]);

        const totals = userAggregates[0] || {};
        const atsChecksTotal = totals.totalAts || 0;
        const aiImprovementsTotal = totals.totalAi || 0;
        const interviewPrepTotal = Math.max(totals.totalInterviewPrep || 0, totalInterviewPrepDocs);
        const jobMatchTotal = totals.totalJobMatch || 0;

        // Visit stats (last 7 days)
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

        // Recent users with full usage and timestamps
        const recentUsersRaw = await User.find()
            .sort({ _id: -1 })
            .limit(10)
            .select('-password')
            .lean();

        const recentUserIds = recentUsersRaw.map(u => u._id);
        const [recentResumesCount, recentConversationsCount] = await Promise.all([
            Resume.aggregate([
                { $match: { userId: { $in: recentUserIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ]),
            ChatConversation.aggregate([
                { $match: { userId: { $in: recentUserIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ])
        ]);

        const resumesMap = {};
        recentResumesCount.forEach(r => { resumesMap[String(r._id)] = r.count; });
        const convosMap = {};
        recentConversationsCount.forEach(c => { convosMap[String(c._id)] = c.count; });

        const recentUsers = recentUsersRaw.map(u => ({
            _id: u._id,
            user_name: u.user_name,
            user_email: u.user_email,
            profile_pic: u.profile_pic || '',
            linkedinId: u.linkedinId || null,
            aiUsageCount: u.aiUsageCount || 0,
            atsUsageCount: u.atsUsageCount || 0,
            interviewPrepCount: u.interviewPrepCount || 0,
            linkedinOptimizerCount: u.linkedinOptimizerCount || 0,
            jobMatchCount: u.jobMatchCount || 0,
            chatCount: u.chatCount || 0,
            resumesCount: resumesMap[String(u._id)] || 0,
            conversationsCount: convosMap[String(u._id)] || 0,
            createdAt: u.createdAt || u._id.getTimestamp(),
            updatedAt: u.updatedAt || u.createdAt || u._id.getTimestamp()
        }));

        res.json({
            sts: 0,
            stats: {
                users: { total: totalUsers, today: newUsersToday, thisWeek: newUsersThisWeek },
                resumes: { total: totalResumes },
                ats: { total: atsChecksTotal },
                aiUsage: { total: aiImprovementsTotal },
                interviewPrep: { total: interviewPrepTotal },
                jobMatch: { total: jobMatchTotal },
                chat: {
                    totalMessages,
                    totalConversations,
                    totalActiveToday: totals.totalChat || 0
                },
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

// ── Search & Paginated Users List ─────────────────────────────────────────────
router.get('/users', adminAuth, async (req, res) => {
    try {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const query = {};
        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [{ user_name: regex }, { user_email: regex }];
        }

        const sortFields = {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            user_name: 'user_name',
            chatCount: 'chatCount',
            atsUsageCount: 'atsUsageCount',
            aiUsageCount: 'aiUsageCount',
            interviewPrepCount: 'interviewPrepCount',
            jobMatchCount: 'jobMatchCount'
        };
        const order = sortOrder === 'asc' ? 1 : -1;
        const sortCriteria = { [sortFields[sortBy] || 'createdAt']: order, _id: order };

        const [total, usersRaw] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .sort(sortCriteria)
                .skip(skip)
                .limit(limitNum)
                .select('-password')
                .lean()
        ]);

        const userIds = usersRaw.map(u => u._id);
        const [resumesAgg, convosAgg] = await Promise.all([
            Resume.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ]),
            ChatConversation.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: '$userId', count: { $sum: 1 } } }
            ])
        ]);

        const resumesMap = {};
        resumesAgg.forEach(r => { resumesMap[String(r._id)] = r.count; });
        const convosMap = {};
        convosAgg.forEach(c => { convosMap[String(c._id)] = c.count; });

        const users = usersRaw.map(u => ({
            _id: u._id,
            user_name: u.user_name,
            user_email: u.user_email,
            profile_pic: u.profile_pic || '',
            linkedinId: u.linkedinId || null,
            aiUsageCount: u.aiUsageCount || 0,
            atsUsageCount: u.atsUsageCount || 0,
            interviewPrepCount: u.interviewPrepCount || 0,
            linkedinOptimizerCount: u.linkedinOptimizerCount || 0,
            jobMatchCount: u.jobMatchCount || 0,
            chatCount: u.chatCount || 0,
            resumesCount: resumesMap[String(u._id)] || 0,
            conversationsCount: convosMap[String(u._id)] || 0,
            createdAt: u.createdAt || u._id.getTimestamp(),
            updatedAt: u.updatedAt || u.createdAt || u._id.getTimestamp()
        }));

        res.json({
            sts: 0,
            users,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1
        });
    } catch (err) {
        console.error('Admin users error:', err);
        res.status(500).json({ sts: 1, msg: 'Failed to fetch users' });
    }
});

// ── Search & Paginated Chat Conversations List ────────────────────────────────
router.get('/conversations', adminAuth, async (req, res) => {
    try {
        const { userId, search, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;

        const query = {};
        if (userId && mongoose.isValidObjectId(userId)) {
            query.userId = userId;
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            const matchingUsers = await User.find({
                $or: [{ user_name: regex }, { user_email: regex }]
            }).select('_id');
            const matchingUserIds = matchingUsers.map(u => u._id);

            query.$or = [
                { title: regex },
                { userId: { $in: matchingUserIds } }
            ];
        }

        const total = await ChatConversation.countDocuments(query);
        const conversations = await ChatConversation.find(query)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('userId', 'user_name user_email profile_pic')
            .lean();

        // Get last message snippet for each conversation
        const convoIds = conversations.map(c => c._id);
        const lastMessages = await ChatMessage.aggregate([
            { $match: { conversationId: { $in: convoIds } } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    lastText: { $first: '$text' },
                    lastRole: { $first: '$role' },
                    lastCreatedAt: { $first: '$createdAt' }
                }
            }
        ]);
        const lastMsgMap = {};
        lastMessages.forEach(m => { lastMsgMap[String(m._id)] = m; });

        const formatted = conversations.map(c => ({
            _id: c._id,
            title: c.title,
            messageCount: c.messageCount || 0,
            lastMessageAt: c.lastMessageAt || c.createdAt,
            createdAt: c.createdAt || c._id.getTimestamp(),
            updatedAt: c.updatedAt || c.createdAt,
            user: c.userId ? {
                _id: c.userId._id,
                user_name: c.userId.user_name,
                user_email: c.userId.user_email,
                profile_pic: c.userId.profile_pic
            } : null,
            lastMessage: lastMsgMap[String(c._id)] ? {
                text: (lastMsgMap[String(c._id)].lastText || '').slice(0, 100),
                role: lastMsgMap[String(c._id)].lastRole,
                createdAt: lastMsgMap[String(c._id)].lastCreatedAt
            } : null
        }));

        res.json({
            sts: 0,
            conversations: formatted,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1
        });
    } catch (err) {
        console.error('Admin conversations error:', err);
        res.status(500).json({ sts: 1, msg: 'Failed to fetch conversations' });
    }
});

// ── Complete Message History for One Conversation ─────────────────────────────
router.get('/conversations/:id/messages', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ sts: 1, msg: 'Invalid conversation ID' });
        }

        const conversation = await ChatConversation.findById(id)
            .populate('userId', 'user_name user_email profile_pic')
            .lean();

        if (!conversation) {
            return res.status(404).json({ sts: 1, msg: 'Conversation not found' });
        }

        const messages = await ChatMessage.find({ conversationId: id })
            .sort({ createdAt: 1 })
            .lean();

        res.json({
            sts: 0,
            conversation: {
                _id: conversation._id,
                title: conversation.title,
                messageCount: conversation.messageCount || messages.length,
                lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
                createdAt: conversation.createdAt || conversation._id.getTimestamp(),
                user: conversation.userId ? {
                    _id: conversation.userId._id,
                    user_name: conversation.userId.user_name,
                    user_email: conversation.userId.user_email,
                    profile_pic: conversation.userId.profile_pic
                } : null
            },
            messages: messages.map(m => ({
                _id: m._id,
                role: m.role,
                text: m.text,
                jobs: m.jobs || [],
                jobSearch: m.jobSearch || null,
                feedback: m.feedback || null,
                createdAt: m.createdAt || m._id.getTimestamp()
            }))
        });
    } catch (err) {
        console.error('Admin conversation messages error:', err);
        res.status(500).json({ sts: 1, msg: 'Failed to fetch messages' });
    }
});

// ── Delete Conversation (Admin Clean-up) ──────────────────────────────────────
router.delete('/conversations/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ sts: 1, msg: 'Invalid conversation ID' });
        }
        await ChatConversation.findByIdAndDelete(id);
        await ChatMessage.deleteMany({ conversationId: id });
        res.json({ sts: 0, msg: 'Conversation deleted successfully' });
    } catch (err) {
        console.error('Admin delete conversation error:', err);
        res.status(500).json({ sts: 1, msg: 'Failed to delete conversation' });
    }
});

function objectIdFromDate(date) {
    const { Types } = require('mongoose');
    return new Types.ObjectId(Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000');
}

module.exports = router;
