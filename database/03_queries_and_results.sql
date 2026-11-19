-- Q01 - Retailers and their stores
SELECT r.name AS retailer, s.store_id, s.branch_name, s.city, s.state
FROM Retailer r JOIN Store s ON s.retailer_id = r.retailer_id
ORDER BY r.name, s.store_id;

-- Q02 - All products with category, brand, package
SELECT product_id, name, brand, package_size, unit, category
FROM Product ORDER BY product_id;


-- Q03 - Customers and administrators
SELECT user_id, name, email, role FROM "User" ORDER BY user_id;

-- Q04 - Current prices for every store/product (latest observation)
WITH ranked AS (
    SELECT pr.*, ROW_NUMBER() OVER (
        PARTITION BY store_id, product_id
        ORDER BY observed_at DESC, price_record_id DESC) AS rn
    FROM PriceRecord pr
)
SELECT s.store_id, r.name AS retailer, p.name AS product, ranked.price, ranked.observed_at
FROM ranked
JOIN Store s ON ranked.store_id = s.store_id
JOIN Retailer r ON s.retailer_id = r.retailer_id
JOIN Product p ON ranked.product_id = p.product_id
WHERE ranked.rn = 1
ORDER BY p.name, ranked.price, s.store_id;

-- Q05 - Compare banana prices across stores
WITH ranked AS (
    SELECT pr.*, ROW_NUMBER() OVER (
        PARTITION BY store_id, product_id
        ORDER BY observed_at DESC, price_record_id DESC) AS rn
    FROM PriceRecord pr
)
SELECT r.name AS retailer, s.store_id, p.name AS product, ranked.price
FROM ranked
JOIN Store s ON ranked.store_id = s.store_id
JOIN Retailer r ON r.retailer_id = s.retailer_id
JOIN Product p ON ranked.product_id = p.product_id
WHERE ranked.rn = 1 AND p.product_id = 202
ORDER BY ranked.price, s.store_id;

-- Q06 - Cheapest store for each product
WITH ranked AS (
    SELECT pr.*, ROW_NUMBER() OVER (
        PARTITION BY store_id, product_id
        ORDER BY observed_at DESC, price_record_id DESC) AS rn
    FROM PriceRecord pr
), cheapest AS (
    SELECT product_id, store_id, price,
           ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY price ASC, store_id ASC) AS rank_price
    FROM ranked WHERE rn = 1
)
SELECT p.name AS product, r.name AS retailer, s.store_id, cheapest.price
FROM cheapest
JOIN Product p ON cheapest.product_id = p.product_id
JOIN Store s ON cheapest.store_id = s.store_id
JOIN Retailer r ON s.retailer_id = r.retailer_id
WHERE rank_price = 1
ORDER BY p.name;

-- Q07 - Shopping lists and their owners
SELECT sl.list_id, sl.name AS list_name, u.name AS owner, sl.created_at
FROM ShoppingList sl JOIN "User" u ON sl.user_id = u.user_id
ORDER BY sl.list_id;

-- Q08 - Products and quantities in shopping list 401
SELECT sl.name AS list_name, p.name AS product, c.quantity, p.unit
FROM ShoppingListItem c
JOIN ShoppingList sl ON sl.list_id = c.list_id
JOIN Product p ON p.product_id = c.product_id
WHERE c.list_id = 401 ORDER BY p.name;

-- Q09 - Total cost to buy shopping list 401 entirely at each store
WITH ranked AS (
    SELECT pr.*, ROW_NUMBER() OVER (
        PARTITION BY store_id, product_id
        ORDER BY observed_at DESC, price_record_id DESC) AS rn
    FROM PriceRecord pr
), latest_prices AS (
    SELECT store_id, product_id, price FROM ranked WHERE rn = 1
)
SELECT r.name AS retailer, s.store_id,
       ROUND(SUM(c.quantity * lp.price), 2) AS total_cost
FROM Store s
JOIN Retailer r ON s.retailer_id = r.retailer_id
JOIN latest_prices lp ON lp.store_id = s.store_id
JOIN ShoppingListItem c ON c.product_id = lp.product_id AND c.list_id = 401
GROUP BY r.name, s.store_id
HAVING COUNT(DISTINCT c.product_id) = (SELECT COUNT(*) FROM ShoppingListItem WHERE list_id = 401)
ORDER BY total_cost, s.store_id;

-- Q10 - Price records submitted by registered users
SELECT u.name AS submitted_by, p.name AS product, s.store_id, pr.price, pr.observed_at
FROM PriceRecord pr
JOIN "User" u ON pr.user_id = u.user_id
JOIN Product p ON pr.product_id = p.product_id
JOIN Store s ON pr.store_id = s.store_id
ORDER BY pr.observed_at, pr.price_record_id;

-- Q11 - Price records without a submitting user (nullable FK)
SELECT pr.price_record_id, p.name AS product, s.store_id, pr.price
FROM PriceRecord pr
JOIN Product p ON pr.product_id = p.product_id
JOIN Store s ON pr.store_id = s.store_id
WHERE pr.user_id IS NULL ORDER BY pr.price_record_id;

-- Q12 - Products with no price record yet
SELECT p.product_id, p.name
FROM Product p LEFT JOIN PriceRecord pr ON pr.product_id = p.product_id
WHERE pr.price_record_id IS NULL
ORDER BY p.product_id;

-- Q13 - Store counts by retailer
SELECT r.name AS retailer, COUNT(s.store_id) AS store_count
FROM Retailer r LEFT JOIN Store s ON s.retailer_id = r.retailer_id
GROUP BY r.retailer_id, r.name
ORDER BY r.name;

-- Q14 - Average of current prices for each product
WITH ranked AS (
    SELECT pr.*, ROW_NUMBER() OVER (
        PARTITION BY store_id, product_id
        ORDER BY observed_at DESC, price_record_id DESC) AS rn
    FROM PriceRecord pr
)
SELECT p.name AS product, COUNT(*) AS stores_with_price, ROUND(AVG(ranked.price), 2) AS avg_price
FROM ranked JOIN Product p ON ranked.product_id = p.product_id
WHERE ranked.rn = 1
GROUP BY p.product_id, p.name
ORDER BY p.name;

-- Q15 - Price history: bananas at store 101
SELECT pr.price_record_id, p.name AS product, pr.price, pr.observed_at
FROM PriceRecord pr JOIN Product p ON pr.product_id = p.product_id
WHERE pr.store_id = 101 AND pr.product_id = 202
ORDER BY pr.observed_at;

-- Q16 - Products by category (aggregate)
SELECT category, COUNT(*) AS product_count
FROM Product GROUP BY category ORDER BY category;

-- Q17 - Number of items and total quantity in each shopping list
SELECT sl.list_id, sl.name AS list_name,
       COUNT(c.product_id) AS distinct_products,
       COALESCE(SUM(c.quantity),0) AS total_quantity
FROM ShoppingList sl LEFT JOIN ShoppingListItem c ON sl.list_id = c.list_id
GROUP BY sl.list_id, sl.name ORDER BY sl.list_id;

-- Q18 - Stores located in Albany
SELECT s.store_id, r.name AS retailer, s.city, s.state, s.zip_code
FROM Store s JOIN Retailer r ON s.retailer_id = r.retailer_id
WHERE s.city = 'Albany' AND s.state = 'NY'
ORDER BY s.store_id;
