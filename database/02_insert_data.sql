INSERT INTO Retailer (retailer_id, name) VALUES
 (1, 'Walmart'), (2, 'Target'), (3, 'ALDI')
ON CONFLICT (retailer_id) DO NOTHING;

INSERT INTO Store (store_id, retailer_id, branch_name, street, city, state, zip_code, latitude, longitude) VALUES
 (101, 1, NULL, '123 Example Street', 'Albany', 'NY', '12207', NULL, NULL),
 (102, 2, 'Albany Test Branch', '456 Example Avenue', 'Albany', 'NY', '12207', NULL, NULL),
 (103, 3, NULL, '789 Sample Road', 'Albany', 'NY', '12207', NULL, NULL),
 (104, 1, 'Brooklyn Test Branch', '10 Demo Street', 'Brooklyn', 'NY', '11201', NULL, NULL)
ON CONFLICT (store_id) DO NOTHING;

INSERT INTO Product (product_id, name, brand, variant, package_size, unit, category) VALUES
 (201, 'Whole Milk', 'Great Value', 'Whole', 1.00, 'gallon', 'Dairy'),
 (202, 'Bananas', NULL, NULL, 1.00, 'lb', 'Produce'),
 (203, 'Large Eggs', NULL, 'Dozen', 12.00, 'count', 'Dairy'),
 (204, 'White Rice', 'Mahatma', NULL, 2.00, 'lb', 'Pantry'),
 (205, 'Bread', 'Wonder', 'Classic White', 1.00, 'loaf', 'Bakery'),
 (206, 'Ground Coffee', 'Folgers', 'Classic Roast', 12.00, 'oz', 'Beverages'),
 (207, 'Apples', NULL, NULL, 1.00, 'lb', 'Produce'),
 (208, 'Greek Yogurt', 'Chobani', 'Plain', 32.00, 'oz', 'Dairy'),
 (209, 'Chicken Breast', NULL, 'Boneless', 1.00, 'lb', 'Meat'),
 (210, 'Olive Oil', 'Bertolli', 'Extra Virgin', 16.90, 'fl oz', 'Pantry'),
 (211, 'Avocado', NULL, NULL, 1.00, 'count', 'Produce'),
 (212, 'Papaya', NULL, NULL, 1.00, 'count', 'Produce')
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO "User" (user_id, name, email, password_hash, role) VALUES
 (301, 'Alex Example', 'alex@example.invalid', 'DEMO_HASH_A', 'customer'),
 (302, 'Jordan Example', 'jordan@example.invalid', 'DEMO_HASH_B', 'customer'),
 (303, 'Taylor Example', 'taylor@example.invalid', 'DEMO_HASH_C', 'customer'),
 (304, 'Morgan Admin', 'admin@example.invalid', 'DEMO_HASH_D', 'admin')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ShoppingList (list_id, user_id, name, created_at) VALUES
 (401, 301, 'Weekly Groceries', '2026-11-08 10:00:00'),
 (402, 302, 'Breakfast Groceries', '2026-11-08 11:00:00'),
 (403, 303, 'Fresh Produce', '2026-11-08 12:00:00')
ON CONFLICT (list_id) DO NOTHING;

INSERT INTO ShoppingListItem (list_id, product_id, quantity) VALUES
 (401, 202, 2.00), (401, 203, 1.00), (401, 204, 1.00), (401, 205, 1.00),
 (402, 201, 1.00), (402, 202, 1.00), (402, 203, 1.00),
 (403, 202, 3.00), (403, 207, 2.00), (403, 211, 2.00)
ON CONFLICT (list_id, product_id) DO NOTHING;

INSERT INTO PriceRecord (price_record_id, store_id, product_id, user_id, price, observed_at) VALUES
 -- Walmart Albany
 (501, 101, 201, 301,  3.49, '2026-11-07 12:00:00'),
 (502, 101, 202, 301,  0.59, '2026-11-06 12:00:00'),
 (503, 101, 203, NULL, 3.99, '2026-11-08 12:00:00'),
 (504, 101, 204, 301,  4.29, '2026-11-08 12:00:00'),
 (505, 101, 205, 301,  3.29, '2026-11-08 12:00:00'),
 (506, 101, 206, 301,  7.99, '2026-11-08 12:00:00'),
 (507, 101, 207, 301,  1.79, '2026-11-08 12:00:00'),
 (508, 101, 208, 301,  5.49, '2026-11-08 12:00:00'),
 (509, 101, 209, NULL, 4.49, '2026-11-08 12:00:00'),
 (510, 101, 210, 301,  9.99, '2026-11-08 12:00:00'),
 (511, 101, 211, 301,  1.09, '2026-11-08 12:00:00'),
 (512, 101, 202, 302,  0.55, '2026-11-08 13:00:00'),
 -- Target Albany
 (513, 102, 202, 302,  0.69, '2026-11-08 13:00:00'),
 (514, 102, 203, 302,  3.79, '2026-11-08 13:00:00'),
 (515, 102, 204, 302,  4.59, '2026-11-08 13:00:00'),
 (516, 102, 205, 302,  3.49, '2026-11-08 13:00:00'),
 (517, 102, 206, NULL, 8.49, '2026-11-08 13:00:00'),
 (518, 102, 207, 302,  1.99, '2026-11-08 13:00:00'),
 (519, 102, 208, 302,  5.79, '2026-11-08 13:00:00'),
 (520, 102, 209, 302,  5.19, '2026-11-08 13:00:00'),
 (521, 102, 210, 302, 10.49, '2026-11-08 13:00:00'),
 -- ALDI Albany
 (522, 103, 202, 303,  0.49, '2026-11-08 14:00:00'),
 (523, 103, 203, 303,  3.29, '2026-11-08 14:00:00'),
 (524, 103, 204, 303,  3.99, '2026-11-08 14:00:00'),
 (525, 103, 205, 303,  2.99, '2026-11-08 14:00:00'),
 (526, 103, 207, 303,  1.59, '2026-11-08 14:00:00'),
 (527, 103, 208, NULL, 5.29, '2026-11-08 14:00:00'),
 (528, 103, 209, 303,  4.19, '2026-11-08 14:00:00'),
 (529, 103, 211, 303,  0.99, '2026-11-08 14:00:00'),
 -- Walmart Brooklyn
 (530, 104, 201, 301,  3.79, '2026-11-08 15:00:00'),
 (531, 104, 202, 301,  0.79, '2026-11-08 15:00:00'),
 (532, 104, 203, 301,  4.19, '2026-11-08 15:00:00'),
 (533, 104, 204, 301,  4.99, '2026-11-08 15:00:00'),
 (534, 104, 205, 301,  3.79, '2026-11-08 15:00:00'),
 (535, 104, 206, 301,  8.19, '2026-11-08 15:00:00'),
 (536, 104, 207, NULL, 2.09, '2026-11-08 15:00:00'),
 (537, 104, 210, 301, 10.99, '2026-11-08 15:00:00')
ON CONFLICT (price_record_id) DO NOTHING;
