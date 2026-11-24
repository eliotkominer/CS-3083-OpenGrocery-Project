import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

// No authentication exists yet, so these routes expose the fictional seeded
// lists read-only. Once sessions exist, both queries must be scoped to the
// signed-in user (WHERE sl.user_id = $session_user).

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT sl.list_id, sl.name, to_json(sl.created_at) AS created_at,
        u.name AS owner_name,
        COUNT(item.product_id)::int AS distinct_products,
        COALESCE(SUM(item.quantity), 0)::text AS total_quantity
      FROM ShoppingList AS sl
      JOIN "User" AS u ON u.user_id = sl.user_id
      LEFT JOIN ShoppingListItem AS item ON item.list_id = sl.list_id
      GROUP BY sl.list_id, sl.name, sl.created_at, u.name
      ORDER BY sl.list_id;
    `);

    res.json({ lists: rows });
  } catch (error) {
    console.error("Shopping list summary query failed:", error);
    res.status(500).json({ error: "Unable to load shopping lists" });
  }
});

router.get("/:listId", async (req, res) => {
  const rawListId = req.params.listId;
  const listId = Number(rawListId);

  if (!/^\d+$/.test(rawListId) || listId > 2_147_483_647) {
    return res.status(400).json({ error: "Invalid list ID" });
  }

  try {
    const listResult = await pool.query(
      `
        SELECT sl.list_id, sl.name, to_json(sl.created_at) AS created_at,
          u.name AS owner_name
        FROM ShoppingList AS sl
        JOIN "User" AS u ON u.user_id = sl.user_id
        WHERE sl.list_id = $1;
      `,
      [listId],
    );

    if (listResult.rows.length === 0) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const itemResult = await pool.query(
      `
        SELECT product.product_id, product.name, product.brand, product.variant,
          product.package_size::text AS package_size, product.unit,
          product.category, item.quantity::text AS quantity
        FROM ShoppingListItem AS item
        JOIN Product AS product ON product.product_id = item.product_id
        WHERE item.list_id = $1
        ORDER BY product.name, product.product_id;
      `,
      [listId],
    );

    res.json({ list: listResult.rows[0], items: itemResult.rows });
  } catch (error) {
    console.error("Shopping list detail query failed:", error);
    res.status(500).json({ error: "Unable to load shopping list" });
  }
});

export default router;
