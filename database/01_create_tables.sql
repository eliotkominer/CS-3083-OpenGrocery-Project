CREATE TABLE Retailer (
    retailer_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Store (
    store_id INTEGER PRIMARY KEY,
    retailer_id INTEGER NOT NULL,
    branch_name VARCHAR(100),
    street VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    FOREIGN KEY (retailer_id) REFERENCES Retailer(retailer_id)
);

CREATE TABLE Product (
    product_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    variant VARCHAR(100),
    package_size DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- Apparently User is a PostgreSQL keyword, so we used double quotes around "User".
CREATE TABLE "User" (
    user_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL
);

CREATE TABLE ShoppingList (
    list_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
);

CREATE TABLE PriceRecord (
    price_record_id INTEGER PRIMARY KEY,
    store_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    user_id INTEGER,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    observed_at TIMESTAMP NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
);

CREATE TABLE ShoppingListItem (
    list_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (list_id, product_id),
    FOREIGN KEY (list_id) REFERENCES ShoppingList(list_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
