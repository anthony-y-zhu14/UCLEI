const http = require('http');
const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const { response } = require('express');
const { json } = require('body-parser');
const app = express();

// let users = fs.readFile("../database/user.json");
let users = {
    username: "jerry137",
    password : "123456",

    name: "Jerry Smith",
    UID: "c117",
    watchlist: ["AAL", "TSLA", "FB", "SHOP"],
    eventList: ["AAL", "SE"],
    ownedStocks: [
        {
            name: "American Airlines Group Inc.",
            quote: "12.74",
            symbol: "AAL",
            share: 20
    }
],
    activity: [
        "Brought 26 shares of TSLA",
        "Sold 26 shares of AAL"
    ],
    account: {
        accountName: "TFSA Account CAD 25MBJ",
        cashBalance: 4048.28,
        investmentBalance: 0
    },
    balanceGrowth: "-20%"

};

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (request, response) => {
    console.log(request.url);
    if(request.url === "/" || request.url === "../index") {
        fs.readFile("../index.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data.toString());
            response.end();
        });
    }
});

app.get('/getBalance', (request, response) => {
    let data = users.account.cashBalance;
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/JSON");
    console.log(`\nClient ${users.username} balance info sent.\n`)
    response.write(data.toString());
    response.end();
});

app.get('/getAccount', (req, res) => {
    let data = JSON.stringify(users);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/JSON");
    console.log(`\nClient ${users.username} account info sent.\n`)
    res.write(data);
    console.log(users);
    res.end();
});

app.post('/authentication', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
    let username = data.username;
    let password = data.password;
    authenticate(username, password);
    response.end();
    });

    function authenticate(username, password) {
        if(users.username === username && users.password === password) {
            console.log(`\nClient ${username} authenticated succesfully.\n`);
            response.write("/html/dashboard.html");
        }
        else {
            response.write("false");
            console.log(`\nClient ${username} provided invalid login.\n`);
        }
    }
 });

 app.post('/updateBalance', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
    users.account["cashBalance"] = data;
    console.log(`\nClient ${users.username} balance updated to ${data}.\n`)
    response.end();
    });
});

app.post('/removeWatchItem', (request, response) => {
   let data = "";
   request.on('data', (chunk) => {
       data = JSON.parse(chunk);
   });

   request.on('end', () => {
   users.watchlist.splice(users.watchlist.indexOf(data), 1);
   response.end();
   });
});

app.post('/addEventNotify', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
    if(!users.eventList.includes(data)) { users.eventList.push(data); }
    response.end();
    });
 });

 app.post('/rmvEventNotify', (request, response) => {
     let data = "";
     request.on('data', (chunk) => {
         data = JSON.parse(chunk);
     });

     request.on('end', () => {
     if(!users.eventList.includes(data)) { users.eventList.splice(users.eventList.indexOf(data, 1)) }
     response.end();
     });
  });

app.post('/addWatchItem', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
        if(!users.watchlist.includes(data)) {
            users.watchlist.push(data);
        }
    response.end();
    });
 });

app.get("/stock-data", (request, response) => {
  fs.readFile("../database/stocks/data.json", function(err, file){
        let search = request.query['search'];
        let lis = JSON.parse(file);
        let data = [];
        response.setHeader("Content-Type", "application/JSON");

        if(lis[search] != null) {
            data.push(lis[search]);
        }

        response.write(JSON.stringify(data));
        response.end();

        });
});

app.post('/buyStock', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
        let quantity = data.n;
        let stockSymbol = data.name;
        buyStock(quantity, stockSymbol);
    response.end();
    });

    function buyStock(quantity, symbol) {

    fs.readFile("../database/stocks/data.json", function(err, file) {
        let lis = JSON.parse(file);
        let stockPrice = parseFloat(lis[symbol]["quote"]);

        /*
        if quantity * stock.price is more than user.account.cashBalance:
            -   alert ("you don't have enough money!")
            -   return
        */
        if(quantity * stockPrice > users.account.cashBalance) {
            console.log("Order not complete");
        }

        /*
        if stock not in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
            -   remove quantity * stock.price amount of cash from user.cashBalance
            -   add stock to users stock holding
            -   update stock shares in user
        */
       for (let index = 0; index < users.ownedStocks.length; index++) {
            let element = users.ownedStocks[index];
            if (element.symbol === symbol){
                users.account["cashBalance"] -=  (stockPrice * parseFloat(quantity));
                users.account.investmentBalance += (stockPrice * parseFloat(quantity));
                element.share += quantity;
                return;
        }
    }
        /*
        else if stock in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
            -   remove quantity * stock.price amount of cash from user.cashBalance
            -   update stock shares in user
        */

        let stock = {
            name: lis[symbol].name,
            quote: lis[symbol].quote,
            shares: quantity
        };

        users.ownedStocks.push(stock);
        users.account["cashBalance"] -= (stockPrice * parseFloat(quantity));
        users.account.investmentBalance += (stockPrice * parseFloat(quantity));

        console.log(users);

    });
        //generate an orderID and add that to user activity and return that
 }
});


app.post('/sellStock', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
        let quantity = data.n;
        let stockSymbol = data.name;
        sellStock(quantity, stockSymbol);
    response.end();
    });

    function sellStock(quantity, symbol) {

    fs.readFile("../database/stocks/data.json", function(err, file) {
        let lis = JSON.parse(file);
        let stock = lis[symbol];
        let stockPrice = parseFloat(lis[symbol]["quote"]);

      /*
        if stock not in user.ownedstock:
            -   alert ("You don't own that stock")
            -   return
        */


        /*
        if stock in user.ownedstock and quantity is less or equal to user.stock.shares:
            -   add quantity * stock.price amount of cash to user.cashBalance
            -   remove quantity * stock.price amount of cash from user.investment
            -   update stock shares in user
        */
        for (let index = 0; index < users.ownedStocks.length; index++) {
            let element = users.ownedStocks[index];
            if (stock.name === element.name && element.share >= quantity) {
                users.account["cashBalance"] += (stockPrice * parseFloat(quantity));
                users.account.investmentBalance -= (stockPrice * parseFloat(quantity));
                element.share -= quantity;
                if(element.share === 0) {
                    users.ownedStocks.splice(index, 1);
                }
            }
        }

        console.log(users);

    });
        //generate an orderID and add that to user activity and return that
 }
});

app.get('/stock-data-w', (request, response) => {
    fs.readFile("../database/stocks/data.json", function(err, file){

        let lis = JSON.parse(file);
        let data = [];
        response.setHeader("Content-Type", "application/JSON");

        for(let j = 0; j < users.watchlist.length; j++) {
          let item = users.watchlist[j];

          data.push(lis[item]);

        }
        response.write(JSON.stringify(data));
        response.end();

      });
  });

app.listen(3001);
console.log('\nServer running at http://127.0.0.1:3001/\n');
