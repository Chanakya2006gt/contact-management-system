require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const pool = require("./db");
const xss = require("xss");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Rate limit for contact route
app.use(
  "/api/contact",
  rateLimit({
    windowMs: 60 * 1000,
    max: 20,
  })
);

// --- Helpers / middleware ---
function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token missing" });
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing in .env");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// --- Health / utility ---
app.get("/api/has-users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM users");
    res.json({ hasUsers: rows[0].cnt > 0 });
  } catch (err) {
    console.error("has-users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Auth: register ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [xss(name), xss(email), hashed, role === "admin" ? "admin" : "user"]
    );
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    // handle duplicate email gracefully
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// --- Auth: login ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in .env");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // return token and basic user info
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Public contact submission ---
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: "Name and message required" });

    await pool.query(
      "INSERT INTO contacts (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())",
      [xss(name), xss(email), xss(subject), xss(message)]
    );

    res.status(201).json({ message: "Sent" });
  } catch (err) {
    console.error("Contact insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Admin: fetch messages (protected) ---
app.get("/api/messages", verifyToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
