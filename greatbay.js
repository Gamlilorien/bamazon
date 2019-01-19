var mysql = require('mysql');
var inquirer = require('inquirer');

//inquirer
inquirer
  .prompt([
    {
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [POST] and auction or [BID] on an auction?",
      choices: ["POST", "BID"]
    }
  ])
  .then(function(answer) {
   //based on their answer, either call the bid or the post functions
   if (answer.postOrBid.toUpperCase() === "POST") {
     postAuction();
   } else {
     bidAuction();
   }
  });

function postAuction() {
  inquirer
    .prompt([
      {
        name: "post",
        type:
      }
    ])
}

//mySQL
var connection = mysql.createConnection({
  host     : 'localhost',
  // Your port; if not 3306
  port: 3306,
  user     : 'root',
  password : 'mysql4boba1',
  database : 'playlists_db'
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  //then show changes
  
});

function bidAuction() {
  //query the database for all items being auctioned
  connection.query("SELECT * FROM Auctions", function(err, results) {
    if (err) throw err;
    //once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i =0; i< results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "what auction whould you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer){
        //get the information for  the chosen item
        var chosenItem;
        for (var i =0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
      
      //determine if bid was high enough
      if (chosenItem.higest_bit < parseInt(answer.bid)) {
        //bid was high enough so update the db and let the user know
        connection.query(
          "UPDATE auctions SET ? WHERE ?",
          [
            {
              higest_bid: answer.bid
            },
            {
              id: chosenItem.id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("Bid placed successfully!");
            start();
          }
        );
      } else {
        //bid wasn't high enough, so apologize and start over
        console.log("Your bid was too low. Try again...");
        start();
      }


      })
  })
}


//FUNCTIONS

// //example select all
// function readAlbums() {
//   connection.query("SELECT * FROM albums", function(err, res) {
//     if (err) throw err;
//     console.log(res);
//     connection.end();
//   });
// };


// Instructions

//allows users to create and bid on assorted items, tasks, jobs, or projects.

//Upon load prompt user to "POST AN ITEM" or "BID ON AN ITEM"

// If "POST AN ITEM" they are prompted for an assortment of information regarding the item and then that information is added to the database so that others can bid on it
// If "BID ON AN ITEM"
//then show itemList
//inquirer bid item
//inquirer bid amount

//If their_bid > highest_bid = inform success and UPDATE higest_bit value.
//ELSE If their_bid <= higest_bid = failure
//return to selection screen.

// Once your group has put together the basic application, it's time to test your collective skills on some additional functionality, or "addons". Remember to take into consideration the amount of time you have been given when choosing what addons you would like to tackle.

// Create a sign up and login system that prompts users for a username and password upon loading up the app. Do not worry about setting up a truly secure database if you choose to tackle this addon. Just worry about building working sign up and login features.

// Create a system on the "POST AN ITEM" which allows users to look at the auctions they have created. On this screen they can add new auctions, modify previous auctions, or close bidding on an auction.

// Create a system which allows users to view all of the auctions of which they are the leading bidder.

// Create a third option on the main screen which allows administrators to modify the database as they see fit.

// Create visually appealing tables. This means making dynamic console code and it is a lot harder than it might seem at first so do not think this one is so simple.

// Create a search function that allows users to look through the database of available auctions to find those that share the specified keyword or username.

//Get creative! There are a lot of addons to this app which you could create so feel free to work with your group to come up with something not listed above!