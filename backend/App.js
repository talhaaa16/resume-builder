const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authrouters = require("./routes/auth");
const db = require("./db/db");
const { scheduleWeeklyReset } = require("./utils/weeklyReset");

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const resumeRouters = require("./routes/resume");
const aiRouters = require("./routes/ai");
const adminRouters = require("./routes/admin");
const PageVisit = require("./models/pageVisit");

app.use(async (req, res, next) => {

  const skip = req.path.startsWith('/api') || req.path === '/ping' || req.path.includes('.');
  if (!skip) {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
      await PageVisit.findOneAndUpdate(
        { date: todayStr },
        {
          $inc: { count: 1 },
          $addToSet: { uniqueIPs: ip }
        },
        { upsert: true }
      );
    } catch (e) { console.error('Failed to update page visit:', e); }
  }
  next();
});

app.use("/api/auth", authrouters);
app.use("/api/resume", resumeRouters);
app.use("/api/ai", aiRouters);
app.use("/api/admin", adminRouters);

app.get("/", (req, res) => {
  res.send("Hello World from Backend ");
});

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start the Monday session-reset job. Runs at boot and once per hour.
scheduleWeeklyReset();

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
