const jwt = require('jsonwebtoken');
const Token = require('../models/token');
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

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
