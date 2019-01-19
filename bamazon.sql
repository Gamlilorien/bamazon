DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER NOT NULL auto_increment,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price INT(6),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

