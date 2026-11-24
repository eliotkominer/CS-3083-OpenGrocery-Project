import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search;

  if (search !== undefined && typeof search !== "string") {
    return res.status(400).json({ error: "Provide a single search value" });
  }

  const term = search?.trim() ?? "";

  if (term.includes("\0")) {
    return res.status(400).json({ error: "Invalid search value" });
  }

  try {
    const { rows } = await pool.query(
      `
        SELECT product_id, name, brand, variant, package_size, unit, category
        FROM Product
        WHERE $1::text = ''
          OR strpos(lower(name), lower($1)) > 0
          OR strpos(lower(brand), lower($1)) > 0
          OR strpos(lower(category), lower($1)) > 0
        ORDER BY product_id;
      `,
      [term],
    );

    res.json({ products: rows });
  } catch (error) {
    console.error("Product catalog query failed:", error);
    res.status(500).json({ error: "Unable to load products" });
  }
});

router.get("/:productId/prices", async (req, res) => {
  const rawProductId = req.params.productId;
  const productId = Number(rawProductId);

  if (
    !/^-?\d+$/.test(rawProductId)
    || productId < -2_147_483_648
    || productId > 2_147_483_647
  ) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const { rows } = await pool.query(
      `
        WITH ranked_prices AS (
          SELECT product_id, store_id, price_record_id, price, observed_at,
            ROW_NUMBER() OVER (
              PARTITION BY store_id, product_id
              ORDER BY observed_at DESC, price_record_id DESC
            ) AS observation_rank
          FROM PriceRecord
          WHERE product_id = $1
        )
        SELECT json_build_object(
            'product_id', product.product_id,
            'name', product.name,
            'brand', product.brand,
            'variant', product.variant,
            'package_size', product.package_size::text,
            'unit', product.unit,
            'category', product.category
          ) AS product,
          ranked.price_record_id, retailer.name AS retailer_name,
          store.store_id, store.branch_name, store.street, store.city,
          store.state, store.zip_code, store.latitude, store.longitude,
          ranked.price, to_json(ranked.observed_at) AS observed_at
        FROM Product AS product
        LEFT JOIN ranked_prices AS ranked
          ON ranked.product_id = product.product_id AND ranked.observation_rank = 1
        LEFT JOIN Store AS store ON store.store_id = ranked.store_id
        LEFT JOIN Retailer AS retailer ON retailer.retailer_id = store.retailer_id
        WHERE product.product_id = $1
        ORDER BY ranked.price ASC, store.store_id ASC;
      `,
      [productId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { product } = rows[0];
    const prices = rows[0].price_record_id === null
      ? []
      : rows.map(({ product, ...price }) => price);
    res.json({ product_id: productId, product, prices });
  } catch (error) {
    console.error("Product price query failed:", error);
    res.status(500).json({ error: "Unable to load product prices" });
  }
});

export default router;
