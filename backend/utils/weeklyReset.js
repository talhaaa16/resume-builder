// Runs a Monday-morning session reset.
// On every Monday (server time), every token issued before the most recent Monday
// is deleted. The auth middleware also re-checks on every protected request so a
// user whose session "expired" because of the weekly reset gets a clean 401
// the next time they hit a protected endpoint.

const Token = require('../models/token');

const MONDAY = 1; // JS getDay(): Sunday=0, Monday=1

function startOfMostRecentMonday(now = new Date()) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    // Distance back to most recent Monday. If today is Monday, this is 0.
    const delta = (day - MONDAY + 7) % 7;
    d.setDate(d.getDate() - delta);
    return d;
}

async function runWeeklyReset(now = new Date()) {
    const cutoff = startOfMostRecentMonday(now);
    const result = await Token.deleteMany({ issuedAt: { $lt: cutoff } });
    if (result.deletedCount) {
        console.log(`🔒 Weekly reset: purged ${result.deletedCount} token(s) issued before ${cutoff.toISOString()}`);
    }
    return result.deletedCount || 0;
}

function scheduleWeeklyReset() {
    // Run once at startup, then once every hour so we don't miss Monday.
    runWeeklyReset().catch(err => console.error('Weekly reset failed:', err));
    setInterval(() => {
        runWeeklyReset().catch(err => console.error('Weekly reset failed:', err));
    }, 60 * 60 * 1000);
}

module.exports = { runWeeklyReset, startOfMostRecentMonday, scheduleWeeklyReset };
