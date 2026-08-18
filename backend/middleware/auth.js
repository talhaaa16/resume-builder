const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const { startOfMostRecentMonday } = require('../utils/weeklyReset');
const SECRET_KEY = process.env.JWT_SECRET || "fallback_dev_secret";

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const activeToken = await Token.findOne({ token });
        if (!activeToken) {
            return res.status(401).json({ msg: 'Session expired or logged out. Please login again.' });
        }

        // ── Weekly Monday reset ────────────────────────────────────────────
        // If this session was issued before the most recent Monday, treat it
        // as logged out and purge the token so the same client cannot reuse it.
        const mondayCutoff = startOfMostRecentMonday();
        if (new Date(activeToken.issuedAt) < mondayCutoff) {
            await Token.deleteOne({ _id: activeToken._id });
            return res.status(401).json({ msg: 'Weekly session reset. Please login again.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
