import "dotenv/config";
import express from "express";
import pool from "./db/pool.js";
const app = express();
const port = Number(process.env.PORT) || 3001;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1;");

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(503).json({ status: "unavailable" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
