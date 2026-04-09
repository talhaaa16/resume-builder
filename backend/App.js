const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authrouters = require("./routes/auth");
const db = require("./db/db");

const app = express();

// Request Logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors()); // Permissive CORS for troubleshooting
app.options("*", cors()); // Handle preflight for all routes

app.use(bodyParser.json());

const resumeRouters = require("./routes/resume");

app.use("/api/auth", authrouters);
app.use("/api/resume", resumeRouters);

app.get("/", (req, res) => {
  res.send("Hello World from Backend ");
});

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
