DROP DATABASE IF EXISTS refresher_db;

CREATE DATABASE refresher_db;

USE refresher_db;

CREATE TABLE people (
	fk_ID INTEGER NOT NULL auto_increment,
    pname VARCHAR(50) NOT NULL,
    age INTEGER(3),
    gender VARCHAR(6),
    PRIMARY KEY (fk_ID)
);

INSERT INTO people (pname, age, gender)
VALUES ("Bob Smith", 44, "Male"),
("Sarah Connor", 33, "Female"),
("Joshua Jones", 19, "Male"),
("Herbert Friedrick", 28, "Male");