var mysql = require("mysql");
var inquirer = require("inquirer");

//****** Inquirer ********
function AskForOrder() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter the ID of the Product you would like to buy: ",
            name: "id"
        },
        {
            type: "input",
            message: "Please enter the desired Quantity: ",
            name: "qty"
        }
    ])
    .then(function(inquirerResponse) {
        //console.log(inquirerResponse)
        var id = inquirerResponse.id;
        var OrderQty = inquirerResponse.qty;

        //Now query the database to see if their is enough in stock
        connection.query("SELECT * FROM products WHERE item_id = ?", [id], function(err, res) {
            var StockQty = res[0].stock_quantity;
            //console.log(res);
            //now evaulate to see if the order can be met with the current stock quantity...
            if (StockQty >= OrderQty) {
                console.log("\nORDER SUCCESS!");
                //now update qty in mySQL and inform user of order total cost
                var totalPrice = res[0].price * OrderQty;
                var newQty = StockQty - OrderQty;
                updateQty(id, newQty);
                console.log("Total Price: $" +totalPrice);
            } else {
                console.log("ORDER DENIED, INSUFFICENT INVENTORY");
            }
            console.log(" Stock Qty: " +StockQty +" \n Order Qty: " + OrderQty +"\n");
        })
        
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
    console.log("\n-----------------------------------\n         WELCOME TO BAMAZON \n-----------------------------------");
    console.log("      Now Viewing All Products \n-----------------------------------\n")

    listAllProducts();
    //now prompt users to place an order once products are displayed    
});


function listAllProducts() {
    connection.query("SELECT * FROM products ORDER BY department_name", function(err, results) {
        if(err) throw err;

        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
        AskForOrder();
    })
}

function updateQty(id, qty) {
    //now update qty in mySQL...
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[qty, id], function(err, results) {
        console.log("Stock Remaining: " +qty);
        
        //allow users option to order again or exit
        //added it here otherwise it would trigger out of turn
        returnToMenu();
    })
    
}

function returnToMenu() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "confirm",
            message: "\nWould you like to return to the main menu?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ])
    .then(function(res) {
        //console.log(inquirerResponse)
        var choice = res.confirm.toLowerCase();
        console.log(choice);
        if (choice === "yes") {
            listAllProducts();
        } else {
            //otherwise end database connection and thus end the script
            connection.end();
        }
        
    });
}