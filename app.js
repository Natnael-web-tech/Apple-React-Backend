const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const connection = mysql.createConnection({
  host: "srv1627.hstgr.io",
  user: "u435044055_myDBuser",
  password: "2025@Evangadi",
  database: "u435044055_myDB",
});
// const corsOption = {
//   origin:[
// "http://localhost:5173"
//   ]
// }
app.use(cors());
// app.use(cors(corsOption));
connection.connect((err) => {
  if (err) console.log(err);
  else console.log("connected to mySql");
});

app.get("/", (req, res) => {
  res.send("running");
});
app.get("/install", (req, res) => {
  let Products_Table = `CREATE TABLE if not exists Products_Table(
Product_id int auto_increment,
Product_url VARCHAR(255) not null,
Product_name VARCHAR(255) not null,
PRIMARY KEY (Product_id)
)`;
  let Product_Description_Table = `CREATE TABLE if not exists Product_Description_Table(
description_id int auto_increment,
Product_id int(11) not null,
product_brief_description text not null,
product_description text not null,
product_img VARCHAR(255) not null,
product_link VARCHAR(255) not null,
PRIMARY KEY (description_id),
FOREIGN KEY (Product_id) REFERENCES Products_Table(Product_id))`;

  let Product_Price_Table = `CREATE TABLE if not exists Product_Price_Table(
Price_id int auto_increment,
Product_id int(11) not null,    
Starting_price VARCHAR(255) not null,
Price_range VARCHAR(255) not null,

PRIMARY KEY (Price_id),
FOREIGN KEY (Product_id) REFERENCES Products_Table(Product_id)
)`;
  let User_Table = `CREATE TABLE if not exists User_Table(
user_id int auto_increment,
User_name int(11) not null,
User_password VARCHAR(255) not null,
PRIMARY KEY (user_id))`;
  let Orders_Table = `CREATE TABLE if not exists Orders_Table(
order_id int auto_increment,
Product_id int(11) not null,
user_id int not null,
PRIMARY KEY (order_id),
FOREIGN KEY (Product_id) REFERENCES Products_Table(Product_id),
FOREIGN KEY (user_id) REFERENCES User_Table(user_id))`;

  connection.query(Products_Table, (err, results, fields) => {
    if (err) console.log(`Error: ${err}`);
  });
  connection.query(Product_Description_Table, (err, results, fields) => {
    if (err) console.log(`Error: ${err}`);
  });
  connection.query(Product_Price_Table, (err, results, fields) => {
    if (err) console.log(`Error: ${err}`);
  });
  connection.query(User_Table, (err, results, fields) => {
    if (err) console.log(`Error: ${err}`);
  });
  connection.query(Orders_Table, (err, results, fields) => {
    if (err) console.log(`Error: ${err}`);
  });

  res.end("Tables Created");
  console.log("Tables Created");
});

app.use(express.urlencoded({ extended: true }));
app.post("/addiphones", (req, res) => {
  const {
    url,
    name,
    brief_description,
    description,
    img,
    link,
    starting_price,
    price_range,
  } = req.body;
  let insertProductData =
    "INSERT INTO Products_Table(Product_url,Product_name) VALUES (?,?)";
  let insertDescription =
    "INSERT INTO Product_Description_Table (Product_id, product_brief_description,product_description,product_img,product_link) VALUES (?,?,?,?,?)";
  let insertPrice =
    "INSERT INTO Product_Price_Table (Product_id, Starting_price,Price_range) VALUES (?,?,?)";

  connection.query(insertProductData, [url, name], (err, results, fields) => {
    if (err) console.log(`Error Found: ${err}`);
    // console.table(results);
    const Product_id = results.insertId;

    connection.query(
      insertDescription,
      [Product_id, brief_description, description, img, link],
      (err, results, fields) => {
        if (err) console.log(`Error Found: ${err}`);
      }
    );
    connection.query(
      insertPrice,
      [Product_id, starting_price, price_range],
      (err, results, fields) => {
        if (err) console.log(`Error Found: ${err}`);
      }
    );
  });

  res.end("Data inserted successfully!");
  console.log("Data inserted successfully!");
});
app.get("/iphones", (req, res) => {
  connection.query(
    `SELECT * FROM Products_Table JOIN Product_Description_Table JOIN Product_Price_Table ON
  Products_Table.Product_id = Product_Description_Table.Product_id AND Products_Table.Product_id = Product_Price_Table.Product_id`,
    (err, rows, fields) => {
      let iphones = { products: [] };
      iphones.products = rows;
      let stringIphones = JSON.stringify(iphones);
      if (!err) res.end(stringIphones);
      else console.log(err);
    }
  );
});
app.listen(2025, () => console.log("listening at http://localhost:2025"));
