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
    const result = await pool.query(
      "SELECT COUNT(*) AS product_count FROM product;",
    );

    res.json({ product_count: result.rows[0].product_count });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database unavailable" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
