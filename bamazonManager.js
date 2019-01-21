var mysql = require("mysql");
var inquirer = require("inquirer");

//****** Inquirer ********
function MenuChoices() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "menu",
            message: "Please select desired program.",
            choices: [
                "View All Products",
                "Run Restock Report",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ])
    .then(function(inquirerResponse) {
        //console.log(inquirerResponse)
        var program = inquirerResponse.menu;

        //route according to user selection
        switch (program) {
            case "View All Products":
            listAllProducts();
            break;

            case "Run Restock Report":
            restockReport();
            break;

            case "Add to Inventory":

            break;

            case "Add New Product":

            break;
        }
    });

}

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
    
    MenuChoices();
    //now prompt users to place an order once products are displayed    
});


function listAllProducts() {
    connection.query("SELECT * FROM products ORDER BY department_name", function(err, results) {
        if(err) throw err;

        console.log("\n-----------------------------------\n         WELCOME TO BAMAZON \n-----------------------------------");
        console.log("      Now Viewing All Products \n-----------------------------------\n")
        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
    })
    //now return to menu
    MenuChoices();
}

function restockReport() {
    connection.query("SELECT * FROM products WHERE stock_quantity <=5 ORDER BY department_name", function(err, results) {
        if(err) throw err;

        console.log("\n-----------------------------------\n         RESTOCK REPORT \n-----------------------------------");
        console.log("   Reorder the following items... \n-----------------------------------\n")
        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
    })
    //now return to menu
    MenuChoices();
}




//don't forget to END!
//connection.end()