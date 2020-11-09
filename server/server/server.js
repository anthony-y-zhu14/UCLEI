const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const session=require('express-session');

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
        "Brought 20 shares of AAL at 12.74"
    ],
    account: {
        accountName: "TFSA Account CAD 25MBJ",
        cashBalance: 4048.28,
        investmentBalance: 0
    },
    balanceGrowth: "-20%"

};

app.use(express.static(path.join(__dirname, '../')));
app.use(cookieParser());
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, //true by default
        maxAge: 3600000, //milliseconds (1hr)
        sameSite: true //'strict/     
    }
}));


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

app.post('/authentication', (request, response, next) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
      console.log(data);

    let username = data.username;
    let password = data.password;
    authenticate(username, password);
    response.end();
    });

    function authenticate(username, password) {
        if(users.username === username && users.password === password) {
            console.log(`\nClient ${username} authenticated succesfully.\n`);

            //generate USER_TOKEN HERE
            const USER_TOKEN = uuidv4();
            let cookie =  request.cookies.cookieName;

            if(cookie === undefined) {
                response.cookie('fleebJuice', USER_TOKEN);
                console.log(`Cookie: ${cookie}, created successfully.`);
            }
            else {
                console.log('cookie already exists', cookie);
            }
            response.write("true");
        }
        else if(username === '' && password === '') {
          response.write('onload');
        }
        else {
            response.write("false");
            console.log(`\nClient ${username} provided invalid login.\n`);
        }
    }
 });

app.get("/logout", function(req, res){
    req.session.destroy(function (err){
        console.log("cookies destroyed!");
    });
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
    console.log(`Client ${users.username} requested account info`)
    res.write(data);
    res.end();
});

app.get('/getWatchlist', (req, res) => {
    let data = JSON.stringify(users.watchlist);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/JSON");
    // console.log(`\nClient ${users.username} watchlist info sent.\n`)
    res.write(data);
    res.end();
});

app.post('/updateBalance', (request, response) => {
    let data = "";
    let newBalance = 0;
    console.log(users)
    console.log(users.account.cashBalance)

    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
        handleTransac(data);
    });

    request.on('end', () => {
      console.log(users.account.cashBalance)
    console.log(`\nClient ${users.username} balance updated to ${data}.\n`)
    response.end();
    });

    function handleTransac(data) {
      if(data.type === 'deposit') {
          users.account.cashBalance += parseInt(data.amount);
      }
      else {
        if(users.account.cashBalance >= parseInt(data.amount)) {
          users.account.cashBalance -= parseInt(data.amount);
        }
      }
    }
});

app.post('/delWatchItem', (request, response) => {
   let data = "";
   request.on('data', (chunk) => {
       data = JSON.parse(chunk);
   });

   request.on('end', () => {
   users.watchlist.splice(users.watchlist.indexOf(data.item), 1);
   response.end();
   console.log(users.watchlist);
   });
});

app.post('/addEventNotify', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    request.on('end', () => {
    if(!users.eventList.includes(data)) {
        users.eventList.push(data); }
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

            
            if(quantity * stockPrice > users.account.cashBalance) {
                console.log("Order not complete");
                return;
            }

            
            for (let index = 0; index < users.ownedStocks.length; index++) {
                let element = users.ownedStocks[index];
                console.log(element.symbol);

                if (element.symbol === symbol){


                    users.account["cashBalance"] -=  (stockPrice * parseFloat(quantity));
                    users.account.investmentBalance += (stockPrice * parseFloat(quantity));
                    element.share += parseInt(quantity);
                    users.activity.push(`Bought ${quantity} shares of ${element.symbol} at $${element.quote}`);
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
                symbol: lis[symbol].symbol,
                share: parseInt(quantity)
            };

            users.ownedStocks.push(stock);
            users.account["cashBalance"] -= (stockPrice * parseFloat(quantity));
            users.account.investmentBalance += (stockPrice * parseFloat(quantity));
            users.activity.push(`Bought ${quantity} shares of ${stock.symbol} at $${stock.quote}`);

        });
            //generate an orderID and add that to user activity and return that

            console.log(`${users.username} bought shares`);
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

        for (let index = 0; index < users.ownedStocks.length; index++) {
            let element = users.ownedStocks[index];
            if (stock.name === element.name && element.share >= parseInt(quantity)) {
                users.account["cashBalance"] += (stockPrice * parseFloat(quantity));
                users.account.investmentBalance -= (stockPrice * parseFloat(quantity));
                element.share -= parseInt(quantity);
                if(element.share === 0) {
                    users.ownedStocks.splice(index, 1);
                }
                users.activity.push(`Sold ${quantity} shares of ${element.symbol} at $${element.quote}`);
            }
        }


    });
        //generate an orderID and add that to user activity and return that
        console.log(`${users.username} sold shares`);

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
