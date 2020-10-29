"use strict";

var http = require('http');

var fs = require("fs"); //reads files


var express = require('express');

var path = require('path');

var url = require('url');

var bodyParser = require('body-parser');

var querystring = require('querystring');

var _require = require('express'),
    response = _require.response;

var _require2 = require('body-parser'),
    json = _require2.json;

var app = express(); // let users = fs.readFile("../database/user.json");

var users = {
  username: "jerry137",
  password: "123456",
  name: "Jerry Smith",
  UID: "c117",
  watchlist: ["AAL", "TSLA", "FB", "SHOP"],
  eventList: ["AAL", "SE"],
  ownedStocks: [{
    name: "American Airlines Group Inc.",
    quote: "12.74",
    symbol: "AAL",
    share: 20
  }],
  activity: ["Brought 26 shares of TSLA", "Sold 26 shares of AAL"],
  account: {
    accountName: "TFSA Account CAD 25MBJ",
    cashBalance: 4048.28,
    investmentBalance: 0
  },
  balanceGrowth: "-20%"
};
app.use(express["static"](path.join(__dirname, '../')));
app.get('/', function (request, response) {
  console.log(request.url);

  if (request.url === "/" || request.url === "../index") {
    fs.readFile("../index.html", function (err, data) {
      if (err) {
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
app.get('/getBalance', function (request, response) {
  var data = users.account.cashBalance;
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/JSON");
  console.log("\nClient ".concat(users.username, " balance info sent.\n"));
  response.write(data.toString());
  response.end();
});
app.get('/getAccount', function (request, response) {
  var data = JSON.stringify(users);
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/JSON");
  console.log("\nClient ".concat(users.username, " account info sent.\n"));
  response.write(data);
  console.log(users);
  response.end();
});
app.post('/authentication', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    var username = data.username;
    var password = data.password;
    authenticate(username, password);
    response.end();
  });

  function authenticate(username, password) {
    if (users.username === username && users.password === password) {
      console.log("\nClient ".concat(username, " authenticated succesfully.\n"));
      response.write("/html/dashboard.html");
    } else {
      response.write("false");
      console.log("\nClient ".concat(username, " provided invalid login.\n"));
    }
  }
});
app.post('/updateBalance', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    users.account["cashBalance"] = data;
    console.log("\nClient ".concat(users.username, " balance updated to ").concat(data, ".\n"));
    response.end();
  });
});
app.post('/removeWatchItem', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    users.watchlist.splice(users.watchlist.indexOf(data), 1);
    response.end();
  });
});
app.post('/addEventNotify', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    if (!users.eventList.includes(data)) {
      users.eventList.push(data);
    }

    response.end();
  });
});
app.post('/rmvEventNotify', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    if (!users.eventList.includes(data)) {
      users.eventList.splice(users.eventList.indexOf(data, 1));
    }

    response.end();
  });
});
app.post('/addWatchItem', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    if (!users.watchlist.includes(data)) {
      users.watchlist.push(data);
    }

    response.end();
  });
});
app.get("/stock-data", function (request, response) {
  fs.readFile("../database/stocks/data.json", function (err, file) {
    var search = request.query['search'];
    var lis = JSON.parse(file);
    var data = [];
    response.setHeader("Content-Type", "application/JSON");

    if (lis[search] != null) {
      data.push(lis[search]);
    }

    response.write(JSON.stringify(data));
    response.end();
  });
});
app.post('/buyStock', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    var quantity = data.n;
    var stockSymbol = data.name;
    buyStock(quantity, stockSymbol);
    response.end();
  });

  function buyStock(quantity, symbol) {
    fs.readFile("../database/stocks/data.json", function (err, file) {
      var lis = JSON.parse(file);
      var stockPrice = parseFloat(lis[symbol]["quote"]);
      /*
      if quantity * stock.price is more than user.account.cashBalance:
          -   alert ("you don't have enough money!")
          -   return
      */

      if (quantity * stockPrice > users.account.cashBalance) {
        console.log("Order not complete");
      }
      /*
      if stock not in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
          -   remove quantity * stock.price amount of cash from user.cashBalance
          -   add stock to users stock holding
          -   update stock shares in user       
      */


      for (var index = 0; index < users.ownedStocks.length; index++) {
        var element = users.ownedStocks[index];

        if (element.symbol === symbol) {
          users.account["cashBalance"] -= stockPrice * parseFloat(quantity);
          users.account.investmentBalance += stockPrice * parseFloat(quantity);
          element.share += quantity;
          return;
        }
      }
      /*
      else if stock in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
          -   remove quantity * stock.price amount of cash from user.cashBalance       
          -   update stock shares in user       
      */


      var stock = {
        name: lis[symbol].name,
        quote: lis[symbol].quote,
        shares: quantity
      };
      users.ownedStocks.push(stock);
      users.account["cashBalance"] -= stockPrice * parseFloat(quantity);
      users.account.investmentBalance += stockPrice * parseFloat(quantity);
      console.log(users);
    }); //generate an orderID and add that to user activity and return that
  }
});
app.post('/sellStock', function (request, response) {
  var data = "";
  request.on('data', function (chunk) {
    data = JSON.parse(chunk);
  });
  request.on('end', function () {
    var quantity = data.n;
    var stockSymbol = data.name;
    sellStock(quantity, stockSymbol);
    response.end();
  });

  function sellStock(quantity, symbol) {
    fs.readFile("../database/stocks/data.json", function (err, file) {
      var lis = JSON.parse(file);
      var stock = lis[symbol];
      var stockPrice = parseFloat(lis[symbol]["quote"]);
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

      for (var index = 0; index < users.ownedStocks.length; index++) {
        var element = users.ownedStocks[index];

        if (stock.name === element.name && element.share >= quantity) {
          users.account["cashBalance"] += stockPrice * parseFloat(quantity);
          users.account.investmentBalance -= stockPrice * parseFloat(quantity);
          element.share -= quantity;

          if (element.share === 0) {
            users.ownedStocks.splice(index, 1);
          }
        }
      }

      console.log(users);
    }); //generate an orderID and add that to user activity and return that
  }
});
app.get('/stock-data-w', function (request, response) {
  fs.readFile("../database/stocks/data.json", function (err, file) {
    var lis = JSON.parse(file);
    var data = [];
    response.setHeader("Content-Type", "application/JSON");

    for (var j = 0; j < users.watchlist.length; j++) {
      var item = users.watchlist[j];
      data.push(lis[item]);
    }

    response.write(JSON.stringify(data));
    response.end();
  });
});
app.listen(3001);
console.log('\nServer running at http://127.0.0.1:3000/\n');