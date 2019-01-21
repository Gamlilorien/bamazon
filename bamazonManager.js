var mysql = require("mysql");
var inquirer = require("inquirer");

//****** Inquirer ********
function MenuChoices() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "menu",
            message: "\nPlease select desired program.",
            choices: [
                "View All Products",
                "Run Restock Report",
                "Receive Inventory",
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

            case "Receive Inventory":
            AddToInventory();
            break;

            case "Add New Product": 
            AddNewProduct();
            break;
        }
    })
};

function restockInput() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter the Product ID that you wish to restock: ",
            name: "productId"
        },
        {
            typ: "input",
            message: "Please enter the restock quantity: ",
            name: "restockQty"
        }
    ])
    .then(function(restockResponse) {
        //console.log(inquirerResponse)
        var productId = restockResponse.productId;
        var restockQty = parseInt(restockResponse.restockQty);
        //var currentQty;

        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?",[productId], function(err, results) {
            //console.log(results);
            var currentQty = results[0].stock_quantity;
            currentQty = parseInt(currentQty);
            console.log("Current Qty: " +currentQty);

            newQty = currentQty + restockQty;
            console.log("New Qty: " +newQty);

            //need to run second query to update inventory
            updateQty(productId, newQty);
            
        })
    })
};


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

    //Now display welcome message and Main Menu
    console.log("\n\n-----------------------------------\n     WELCOME BAMAZON MANAGER \n-----------------------------------");
    
    MenuChoices();
    //now prompt users to place an order once products are displayed    
});


function listAllProducts() {
    connection.query("SELECT * FROM products ORDER BY department_name", function(err, results) {
        if(err) throw err;

        console.log("\n\n-----------------------------------");
        console.log("      Now Viewing All Products \n-----------------------------------\n")
        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
        //now return to menu
        returnToMenu();
    })
};

function restockReport() {
    connection.query("SELECT * FROM products WHERE stock_quantity <=5 ORDER BY department_name", function(err, results) {
        if(err) throw err;

        console.log("\n\n-----------------------------------\n         RESTOCK REPORT \n-----------------------------------");
        console.log("   Reorder the following items... \n-----------------------------------\n")
        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +" \n Product: " +results[i].product_name +" \n Department: " +results[i].department_name +" \n Price: " +results[i].price +" \n Qty: " +results[i].stock_quantity + " \n-----------------------------------\n");
        }
        //now return to menu
        returnToMenu();
    })
};

function AddToInventory() {
    //First list all items and their current qty
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw err;

        console.log("\n\n-----------------------------------\n     RESTOCK PRODUCT INVENTORY \n-----------------------------------");
        //now grab each record from mySQL
        for (var i=0; i< results.length; i++) {
            console.log("ID: " +results[i].item_id +", Product: " +results[i].product_name +", Qty: " +results[i].stock_quantity +"\n");
        }
        //put inside a function so it would render AFTER the AddToInventory commands?
        restockInput();
    })    
};

function AddNewProduct() {
    //use inquirer to get user input
    inquirer
    .prompt([
        {
            type: "input",
            message: "Product Name: ",
            name: "name"
        },
        {
            type: "list",
            message: "Department: ",
            name: "department",
            choices: [
                "Books",
                "Computers & Technology",
                "Home",
                "Kitchen"
            ]
        },
        {
            type: "input",
            message: "Price: ",
            name: "price"
        },
        {
            type: "input",
            message: "Qty: ",
            name: "qty"
        }
    ])
    .then(function(res) {
        //console.log(inquirerResponse)
        var name = res.name;
        var department = res.department;
        var price = res.price;
        var qty = res.qty;

        //now we add new record to the mySQL database with user values
        createProduct(name, department, price, qty);
       
    })
};

function createProduct(name, department, price, qty) {
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: name,
        department_name: department,
        price: price,
        stock_quantity: qty
      })
      console.log("Product Added!")
      //now return to menu?
      returnToMenu();
  };

function updateQty(id, qty) {
    //now update qty in mySQL...
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[qty, id], function(err, results) {
        console.log("Stock Remaining: " +qty);
        //added here otherwise triggered out of order
        returnToMenu();
    })
};

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
            MenuChoices();
        } else {
            //otherwise end database connection and thus end the script
            connection.end();
        }
        
    });
};

