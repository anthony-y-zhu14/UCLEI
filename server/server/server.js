const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const e = require("express");

const users = JSON.parse(fs.readFileSync("../database/users/users.json"));

app.use(express.static(path.join(__dirname, '../')));
app.use(cookieParser());
app.use(session({
    cookieName: 'Plumbus',
    secret: 'fleeb_juice',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, //true by default
        maxAge: 3600000, //milliseconds (1hr)
        sameSite: true //strict
    }
}));

function isSessionValid(s, u){
    if(s && u){
        return true;
    }
    return false;
}

function updateUserDataBase(u){
    fs.writeFileSync("../database/users/users.json", JSON.stringify(u, null, 2));
    console.log('saved!');
}


app.post('/authentication', (request, response) => {
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
        if(users[username] !== null && users[username]['password'] === password) {
            console.log(`Client ${username} authenticated succesfully.`);

            //generate USER_TOKEN HERE

            const USER_TOKEN = uuidv4();

            request.session.user = users[username]['username'];

            users[username]['session_id'] = USER_TOKEN;
            const login_data = {
                authentication: true,
                session_id: USER_TOKEN
            };
            response.write(JSON.stringify(login_data));
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
    console.log(`${users[req.session.user].username} Logged Out, Cookie destroyed`);
    users[req.session.user]["session_id"] = null;
    req.session.destroy();

});

app.get("/session", function(req, res){
    let data = '';
    if (req.session.user){
        data = users[req.session.user]['session_id'];
    }
    else{
        data = null;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/JSON");
    res.write(JSON.stringify(data));
    console.log(data);
    res.end();
});

app.get('/getBalance', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = users[username]['account']['cashBalance'];
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/JSON");
        console.log(`\nClient ${users[request.session.user].username} balance info sent.\n`)
        response.write(data.toString());
        response.end();
    }
});

app.get('/getAccount', (req, res) => {

    if (isSessionValid(req.session, req.session.user)){
        let data = JSON.stringify(users[req.session.user]);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        console.log(`Client ${users[req.session.user].username} requested account info`)
        res.write(data);
        res.end();
    }
});

app.get('/getWatchlist', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = JSON.stringify(users[req.session.user]['watchlist']);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        // console.log(`\nClient ${users.username} watchlist info sent.\n`)
        res.write(data);
        res.end();
    }
});

app.post('/updateBalance', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";;

        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
            handleTransac(data);
        });

        request.on('end', () => {
        console.log(`\nClient ${users[request.session.user].username} balance updated to ${data}.\n`)
        updateUserDataBase(users);
        response.end();

        });

        function handleTransac(data) {
        if(data.type === 'deposit') {
            users[request.session.user]['account']['cashBalance'] += parseInt(data.amount);
        }
        else {
            if(users[request.session.user]['account']['cashBalance'] >= parseInt(data.amount)) {
            users[request.session.user]['account']['cashBalance'] -= parseInt(data.amount);
            }
        }
        }
    }
});

app.post('/delWatchItem', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        request.on('end', () => {
        users[request.session.user]['watchlist'].splice(users[request.session.user]['watchlist'].indexOf(data.item), 1);
        updateUserDataBase(users);
        response.end();
        console.log(users[request.session.user]['watchlist']);
    });
}
});

app.post('/addEventNotify', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        request.on('end', () => {
        if(!users[request.session.user]['eventList'].includes(data)) {
            users[request.session.user]['eventList'].push(data); }
        updateUserDataBase(users);
        response.end();
        });

    }

 });


app.post('/rmvEventNotify', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        request.on('end', () => {
        if(!users[request.session.user]['eventList'].includes(data)) { users[request.session.user]['eventList'].splice(users[request.session.user]['eventList'].indexOf(data, 1)) }
        updateUserDataBase(users);
        response.end();
        });
    }
  });

app.post('/addWatchItem', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        request.on('end', () => {
            if(!users[request.session.user]['watchlist'].includes(data.value)) {
                users[request.session.user]['watchlist'].push(data.value);
            }
            updateUserDataBase(users);
            response.end();
        });
    }
 });

app.get("/stock-data", (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
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
    }
});

app.post('/buyStock', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        request.on('end', () => {
            let quantity = data.n;
            let stockSymbol = data.name;
            let limitPrice = data.limit_price;
            buyStock(quantity, stockSymbol, limitPrice);
            response.end();
        });

        function buyStock(quantity, symbol, limitPrice) {

            let stockData = JSON.parse(fs.readFileSync("../database/users/openBuyOrders.json"));

            let date = new Date();
            // let today = date.toISOString().slice(0,10);

            fs.readFile("../database/stocks/data.json", function(err, file) {
                let lis = JSON.parse(file);
                let stockPrice = parseFloat(lis[symbol]["quote"]);

                if(quantity * stockPrice > users[request.session.user]['account']['cashBalance']) {
                    console.log("Order not complete");
                    return;
                }

                let stock = {
                  name: lis[symbol].name,
                  quote: lis[symbol].quote,
                  symbol: lis[symbol].symbol,
                  share: parseInt(quantity),
                  orderType: 'Buy',
                  orderId: uuidv4(),
                  username: users[request.session.user]['username'],
                  date: date,
                  limitPrice: limitPrice
                };
                
                stockData.push(stock);
                
                
                users[request.session.user]['openOrders'].push(stock);

                fs.writeFileSync("../database/users/BuyOrders.json", JSON.stringify(stockData, null, 2));
                validateBuy(quantity, symbol, limitPrice, users[request.session.user]['username']);
            });
          updateUserDataBase(users);
        }
    }
});

function validateBuy(quantity, symbol, limitPrice, user) {

    let sellData = JSON.parse(fs.readFileSync("../database/users/openSellOrders.json"));
    let stockData = JSON.parse(fs.readFileSync("../database/stocks/data.json"));

    for(let i = 0; i < sellData.length; i++) {

        if(symbol === sellData[i].symbol && sellData[i].share >= quantity && sellData[i].limitPrice <= limitPrice) {

            let stock = {

                name: stockData[symbol].name,
                quote: sellData[i].limitPrice,
                symbol: stockData[symbol].symbol,
                share: parseInt(quantity)
                
            };
            users[user]['account']["cashBalance"] -=  (sellData[i].limitPrice * parseFloat(quantity));
            users[user]['account']['investmentBalance'] += (sellData[i].limitPrice * parseFloat(quantity));
            console.log("Before: ");
            console.log(sellData);

            sellData[i].share -= quantity;

            //users[request.session.user]['eventList'].splice(users[request.session.user]['eventList'].indexOf(data, 1))
            if (sellData[i].share === 0){                
                sellData.splice(i, 1);
            }
            console.log("After: ")
            console.log(sellData);
            users[user]['activity'].push(`Bought ${quantity} shares of ${stock.symbol} at $${stock.quote}`);

            if(users[user]['ownedStocks'].includes(stock)) {
                users[user]['ownedStocks'][users[user]['ownedStocks'].indexOf(stock)].share += quantity;

                return;
                
                //deal with avg price later.
            }
            else{
                users[user]['ownedStocks'].push(stock);
                return;
            }
            
        }
    }
}

app.post('/sellStock', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
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

            for (let index = 0; index < users[request.session.user]['ownedStocks'].length; index++) {
                let element = users[request.session.user]['ownedStocks'][index];
                if (stock.name === element.name && element.share >= parseInt(quantity)) {
                    users[request.session.user]['account']["cashBalance"] += (stockPrice * parseFloat(quantity));
                    users[request.session.user]['account']['investmentBalance'] -= (stockPrice * parseFloat(quantity));
                    element.share -= parseInt(quantity);
                    if(element. share === 0) {
                        users[request.session.user]['ownedStocks'].splice(index, 1);
                    }
                    users[request.session.user]['activity'].push(`Sold ${quantity} shares of ${element.symbol} at $${element.quote}`);
                }
            }
        });
            updateUserDataBase(users);

        }
    }
});

app.get('/stock-data-w', (request, response) => {
    if (isSessionValid(request.session, request.session.user)){
        fs.readFile("../database/stocks/data.json", function(err, file){
            let lis = JSON.parse(file);
            let data = [];
            response.setHeader("Content-Type", "application/JSON");

            for(let j = 0; j < users[request.session.user]['watchlist'].length; j++) {
            let item = users[request.session.user]['watchlist'][j];
            data.push(lis[item]);
            }
            response.write(JSON.stringify(data));
            updateUserDataBase(users);

            response.end();

        });
    }
  });

app.listen(3001);
console.log('\nServer running at http://127.0.0.1:3001/\n');
