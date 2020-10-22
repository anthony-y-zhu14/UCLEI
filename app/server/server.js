const http = require('http');
const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const { response } = require('express');
const { json } = require('body-parser');
const app = express();

// let users = fs.readFile("../database/user.json");
let users = {
    username: "jerry137",
    password : "123456",

    name: "Jerry Smith",
    UID: "c117",
    watchlist: ["AAL", "TSLA"],
    ownedStocks: [
        {
            name: "American Airlines Group Inc.",
            quote: "12.74",
            symbol: "AAL",
            share: 20
    }
],
    activity: [
<<<<<<< HEAD
        "Brought 26 shares of TSLA",
        "Sold 26 shares of AAL"
=======

>>>>>>> 952fdcaf948898eac1b0087031c4670693fca938
    ],
    account: {
        accountName: "TFSA",
        cashBalance: 4048.28,
        investmentBalance: "0"
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

app.get('/getAccount', (request, response) => {
    let data = JSON.stringify(users);
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/JSON");
    console.log(`\nClient ${users.username} account info sent.\n`)
    response.write(data);
    console.log(users);
    response.end();
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

app.get('/stock-data', (request, response) => {
  fs.readFile("../database/stocks/data.json", function(err, data){
      if(err) {
        console.log("Error reading file.")
        return;
      }
      lis = JSON.parse(data)
      console.log("bar");
      for (let i = 0; i < 1000; i++) {
        console.log(lis..name);
        for(let j = 0; j < user.watchlist.length; j++) {
          if (lis[i] === user.watchlist[j]) {
            console.log(list[i]);
          }
        }
      }
      response.end();

});
});

app.listen(3000);
console.log('\nServer running at http://127.0.0.1:3000/\n');
