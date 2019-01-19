var mysql = require("mysql");
var inquirer = require("inquirer");

//****** mySQL ********
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql4boba1",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;

    //Now display welcome message and list available products
    console.log("\n-----------------------------------\n         WELCOME TO BAMAZON \n-----------------------------------");
    console.log("      Now Viewing All Products \n-----------------------------------\n")

    listAllProducts();
});


//****** Inquirer ********
// inquirer
//     .prompt([
//         {

//         }
//     ])

//var productsArray = [];

function listAllProducts() {
    connection.query("SELECT * FROM products ORDER BY department_name", function(err, results) {
        if(err) throw err;

        //now grab each record from mySQL
        // console.log(results);
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
        //productsArray(result);
        //console.log(results);
        //console.log(productsArray);
        //don't forget to END!
        connection.end()
    })
}


