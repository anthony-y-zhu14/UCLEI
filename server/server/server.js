const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const stockOrder = require("./stockOrder.js");
const serverReset = require("./serverRest.js");
const { request } = require("http");
let users = {};

app.use(express.static(path.join(__dirname, '../')));
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

/* begins the event watcher on server start
 * eventWatcher fires every 5 minutes,
 * checking each user's events subscriptions
 * and updating the user's data as required
*/
let eventWatcher = require("./eventLoop.js");
let today = new Date().toISOString().slice(0,10);


/**********************************************
    Helper Functions
     - handles:
        - checking for valid sessions
        - updating data base  (currently JSON files)
**********************************************/

function isSessionValid(s, u){
    if(s && u){
        return true;
    }
    return false;
}

function updateUserDataBase(){
    fs.writeFileSync("../database/users/users.json", JSON.stringify(users, null, 2));
    eventWatcher.updateUserDataBase(users);
}

/**********************************************
    Account authentication Get and Post Requests:
     - handles a users:
        - authentication to the server
        - logging in / out
        - creating session & cookie
        - destroying cookie on logout
**********************************************/
app.post('/authentication', (req, res) => {
    users = JSON.parse(fs.readFileSync("../database/users/users.json"));
    let data = "";
    req.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    req.on('end', () => {
      console.log(data);

    let username = data.username;
    let password = data.password;
    authenticate(username, password);
    res.end();
    });

    function authenticate(username, password) {
        if(users[username] && users[username]['password'] === password) {
            console.log(`Client ${username} authenticated succesfully.`);
            const USER_TOKEN = uuidv4();
            req.session.user = users[username]['username'];
            req.session.session_id = USER_TOKEN;
            const login_data = {
                authentication: 'true',
                session_id: USER_TOKEN
            };
            res.write(JSON.stringify(login_data));
        }
        else if(users[username] && users[username]['password'] !== password) {
          const login_data = {
              authentication: 'passwordError',
              session_id: false
          };
          res.write(JSON.stringify(login_data));
        } else {
            const login_data = {
                authentication: 'usernameError',
                session_id: false
            };
            res.write(JSON.stringify(login_data));
        }
    }
});

app.post('/register', (req, res) => {

    users = JSON.parse(fs.readFileSync("../database/users/users.json"));

    let data = "";
    req.on('data', (chunk) => {
        data = JSON.parse(chunk);
    });

    req.on('end', () => {
        console.log(data);

    let username = data.username;
    let password = data.password;
    let name = data.name;
    register(username, password, name);
    res.end();
    });

    function register(username, password, name) {
        if(!users[username]) {
            const USER_TOKEN = uuidv4();
            let newUser = {
                username: username,
                password: password,
                session_id: USER_TOKEN,
                name: name,
                watchlist: [],
                openOrders: [],
                eventList: [],
                ownedStocks: [],
                activity: [],
                account: {
                    accountName: "Tax Free Savings Account",
                    cashBalance: 0,
                    investmentBalance: 0,
                    totalDeposit: 0
                },
                balanceGrowth: "0"
            }

            users[username] = newUser;
            req.session.user = users[username]['username'];
            req.session.session_id = USER_TOKEN;

            const login_data = {
                authentication: 'true',
                session_id: USER_TOKEN
            };
            updateUserDataBase();
            res.write(JSON.stringify(login_data));
        }
        else if(users[username]) {
            const login_data = {
                authentication: 'usernameError',
                session_id: false
            };
            res.write(JSON.stringify(login_data));
        }
        else {
            res.write("false");
            console.log(`\n${username} attempted to register.\n`);
        }
    }
});

app.get("/logout", function(req, res){
    console.log(`${req.session.user} Logged Out, Cookie destroyed`);
    // users[req.session.user]["session_id"] = null;
    // updateUserDataBase();
    req.session.destroy();

});

app.get("/session", function(req, res){
    let data = '';
    if (req.session.user){
        data = req.session.session_id;  
    }
    else{
        data = null;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/JSON");
    res.write(JSON.stringify(data));
    res.end();
});

/**********************************************
    Account Post and Get Requests:
     - handles a user:
        - checking their current balance
        - checking their account information
        - updating their balance on a withdrawl or deposit
**********************************************/

app.get('/getBalance', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = users[req.session.user]['account']['cashBalance'];
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        console.log(`\nClient ${users[req.session.user].username} balance info sent.\n`)
        res.write(data.toString());
        res.end();
    }

});

app.get('/getAccount', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = JSON.stringify(users[req.session.user], null, 2);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        // console.log(`Client ${users[req.session.user].username} requested account info`)
        res.write(data);
        res.end();
    }

});

app.post('/updateBalance', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
            handleTransac();
        });
        req.on('end', () => {
        console.log(`\nClient ${users[req.session.user].username} balance updated to ${data}.\n`)
        updateUserDataBase();
        res.end();
        });

        function handleTransac() {
            if(data.type === 'deposit') {
                users[req.session.user]['account']['cashBalance'] += parseInt(data.amount);
                users[req.session.user]['account']['totalDeposit'] += parseInt(data.amount);
                let activityMessage = `Deposited $${parseInt(data.amount)} to account: ${users[req.session.user].account.accountName}`;
                let newActivity = stockOrder.creatNewActivity('deposite', activityMessage);
                stockOrder.updateUserActivity(users[req.session.user].activity, newActivity);
            }
            else {
                if(users[req.session.user]['account']['cashBalance'] >= parseInt(data.amount)) {
                users[req.session.user]['account']['cashBalance'] -= parseInt(data.amount);
                users[req.session.user]['account']['totalDeposit'] -= parseInt(data.amount);
                let activityMessage = `Withdrawn $${parseInt(data.amount)} to account: ${users[req.session.user].account.accountName}`;
                let newActivity = stockOrder.creatNewActivity('withdraw', activityMessage);
                stockOrder.updateUserActivity(users[req.session.user].activity, newActivity);
                }
            }
        }
    }

});

/**********************************************
    Watchlist Post and Get Requests:
     - handles a user:
        - adding an item to their watchlist
        - removing items to a watchlist
        - viewing their watchlist
**********************************************/

app.get('/getWatchlist', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = JSON.stringify(users[req.session.user]['watchlist']);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        res.write(data);
        res.end();
    }

});

app.post('/addWatchItem', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });
        req.on('end', () => {

            let stock = stockDatabase[data.value];

            let watchItem = {
                symbol: stock.symbol,
                quote: stock.quote,
                name: stock.name,
                volume: stock.volume
            };

            let isItemInList = false;
            for(let i = 0; i < users[req.session.user]['watchlist'].length; i++) {
                if(users[req.session.user]['watchlist'][i].symbol === watchItem.symbol) {
                    isItemInList = true;
                }
            }

            if(!isItemInList) {
                users[req.session.user]['watchlist'].push(watchItem);
            }
            updateUserDataBase();
            res.end();
        });
    }

});

app.post('/delWatchItem', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['watchlist'].length; i++) {
                if(users[req.session.user]['watchlist'][i]['symbol'] === data.item) {
                    users[req.session.user]['watchlist'].splice(i, 1);
                }
            }
            updateUserDataBase();
            res.end();
        });
    }
});

/**********************************************
    Event Post and Get Requests:
     - handles a user:
        - adding an item to their events
        - removing items to their events
        - viewing their events
        - notifying user on events
        - deactivating and activating events
********************************************* */

app.get('/getEvents', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = JSON.stringify(users[req.session.user]['eventList']);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        res.write(data);
        res.end();
    }
    res.statusCode = 401;
    res.write("<h1>401 Not Authorized.</h1>");
    res.end();
});

app.get('/getNotified', (req, res) => {
  if (isSessionValid(req.session, req.session.user)){
    let data = {};

    let d = eventWatcher.getCount();
    for (let i = 0; i < d.length; i++){
        let event = d[i];
        if (req.session.user === event.user){
            data = event;
        }
    }
 res.statusCode = 200;
      res.setHeader("Content-Type", "application/JSON");
      res.write(JSON.stringify(data));
      res.end();
  }
});

app.post('/addEventNotify', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });
        req.on('end', () => {

            let stock = stockDatabase[data.name];

            let eventItem = {
                symbol: stock['symbol'],
                quote: stock['quote'],
                name: stock['name'],
                active: "Active",
                notified: false,
                notify_num: parseFloat(data.num),
                message: ''
            };

            let isItemInList = false;
            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === eventItem.symbol) {
                    isItemInList = true;
                    users[req.session.user]['eventList'][i]['notify_num'] = data.num;
                    users[req.session.user]['eventList'][i]['active'] = "Active";
                    users[req.session.user]['eventList'][i]['message'] = "";
                    users[req.session.user]['eventList'][i]['notified'] = false;
                }
            }
            if(!isItemInList) {
                users[req.session.user]['eventList'].push(eventItem);
            }

            updateUserDataBase();
            res.end();
        });
    }
});

app.post('/rmvEventNotify', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === data.item) {
                    users[req.session.user]['eventList'].splice(i, 1);
                }
            }
            updateUserDataBase();
            res.end();
        });
    }
});

app.post('/reactivateEvent', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === data.item) {
                    if(users[req.session.user]['eventList'][i]['active'] === "Active") {
                        users[req.session.user]['eventList'][i]['active'] = "Deactive";
                        users[req.session.user]['eventList'][i]['message'] = "";
                        users[req.session.user]['eventList'][i]['notified'] = false;
                    } else {
                        users[req.session.user]['eventList'][i]['active'] = "Active";
                        users[req.session.user]['eventList'][i]['notified'] = false;

                    }
                }
            }
            updateUserDataBase();
            res.end();
        });
    }
});

app.post('/updateEventNum', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === data.value) {
                    users[req.session.user]['eventList'][i]['notify_num'] = parseFloat(data.num);
                    users[req.session.user]['eventList'][i]['active'] = "Active";
                    users[req.session.user]['eventList'][i]['message'] = "";
                }
            }
            updateUserDataBase();
            res.end();
        });
    }
});

/**********************************************
    Buy and Sell Stock Post and Get Requests:
     - handles a user:
        - buying a stock
        - selling a stock
********************************************* */

app.post('/buyStock', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {
            let quantity = data.n;
            let stockSymbol = data.name;
            let limitPrice = data.limit_price;
            buyStock(quantity, stockSymbol, limitPrice);
            res.end();
        });

        function buyStock(quantity, symbol, limitPrice) {

            /**********************************************
            check if user have enough cash to cover this order
            ********************************************* */
            if(quantity * limitPrice <= users[req.session.user]['account']['cashBalance']) {

                let sum = 0;

                 /**********************************************
                check if user have enough cash to cover all previous order to the same stock
                ********************************************* */
                for (let j = 0; j < users[req.session.user]['openOrders'].length; j++){
                    if (users[req.session.user]['openOrders'][j]['symbol'] === symbol
                    && users[req.session.user]['openOrders'][j]['orderType'] === "buy"){
                        sum += users[req.session.user]['openOrders'][j]['share'] * users[req.session.user]['openOrders'][j]['share'];
                    }
                }

                if (users[req.session.user]['account']['cashBalance'] - sum >= 0){

                    stockOrder.validateBuy(quantity, symbol, limitPrice, users[req.session.user]['username'], users, stockDatabase);
                    return;
                }
            }

            console.log(`User: ${users[req.session.user]['username']} does not have the required amount of cash balance to complete this sale.`);

        }

    }
});

app.post('/sellStock', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {
            let quantity = data.n;
            let stockSymbol = data.name;
            let limitPrice = data.limit_price;
            sellStock(quantity, stockSymbol, limitPrice);
            res.end();

        });

        function sellStock(quantity, symbol, limitPrice) {

            for(let i = 0; i < users[req.session.user]['ownedStocks'].length; i++) {
                if(users[req.session.user]['ownedStocks'][i]['symbol'] === symbol && users[req.session.user]['ownedStocks'][i]['share'] >= quantity) {
                    let sum = 0;

                    for (let j = 0; j < users[req.session.user]['openOrders'].length; j++){
                        if (users[req.session.user]['openOrders'][j]['symbol'] === symbol
                        && users[req.session.user]['openOrders'][j]['orderType'] === "sell"){
                            sum += users[req.session.user]['openOrders'][j]['share'];
                        }
                    }

                    if (users[req.session.user]['ownedStocks'][i]['share'] - sum >= quantity){
                        stockOrder.validateSell(quantity, symbol, limitPrice, users[req.session.user]['username'], users, stockDatabase);
                        return;
                    }

                }
            }
            console.log(`User: ${users[req.session.user]['username']} does not have the required stock or amount of shares to complete this sale.`);
        }
    }
});

app.post('/cancelOrder', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let orderId = "";
        req.on('data', (chunk) => {
            orderId = JSON.parse(chunk);
        });

        req.on('end', () => {
            stockOrder.cancelOrder(orderId, users[req.session.user]);
            updateUserDataBase();
            res.end();
        });
    }
});

/**********************************************
    Stock Info Get Requests:
     - handles a user:
        - getting info of a particular stock
        - searching for a stock ticker
********************************************* */

app.get('/stock-data-w', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let data = [];
        res.setHeader("Content-Type", "application/JSON");
        for(let j = 0; j < users[req.session.user]['watchlist'].length; j++) {
        let item = users[req.session.user]['watchlist'][j];
        data.push(stockDatabase[item]);
        }
        res.write(JSON.stringify(data));
        updateUserDataBase();
        res.end();
    }
  });

app.get('/pop-stock-data', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));

        let data = [];

        //this will eventually give popular stocks by volume! We need more data!!
        data.push(stockDatabase['AMD']);
        data.push(stockDatabase['SE']);
        data.push(stockDatabase['FB']);

        if (isSessionValid(req.session, req.session.user)){
            res.setHeader("Content-Type", "application/JSON");
            res.write(JSON.stringify(data));
            res.end();
        }
    }
  });

app.get("/stock-data", (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
        let search = req.query['search'];
        let data = [];
        res.setHeader("Content-Type", "application/JSON");
        if(stockDatabase[search] != null) {
            data.push(stockDatabase[search]);          
        }
        else {
            data.push(stockDatabase['D35-C']); 
                  
        }
        res.write(JSON.stringify(data));
        res.end();
    }
});

app.get("/all-stocks", (req, res) => {
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let data = [];
    res.setHeader("Content-Type", "application/JSON");
    data.push(stockDatabase);
    res.write(JSON.stringify(data));
    res.end();
});


/**********************************************
Public API (call requests to this api using port 3001)
********************************************* */

app.get("/stocks", (req, res) => {
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let symbol = req.query.symbol? req.query.symbol.toUpperCase(): undefined;
    let min = parseFloat(req.query.minprice);
    let max = parseFloat(req.query.maxprice);

    let data = [];
    res.setHeader("Content-Type", "application/JSON");
    if (!symbol && !min &&!max){
        res.write(JSON.stringify(stockDatabase, null, 2));
        res.end();
        return;
    }
    else if(!symbol && min && max){
        for (const stock in stockDatabase){
            if(stockDatabase[stock].quote <= max && stockDatabase[stock].quote >= min){
                data.push(stockDatabase[stock]);
            }
        }
    }
    else if(!symbol && !min && max){
        for (const stock in stockDatabase){
            if(stockDatabase[stock].quote <= max){
                data.push(stockDatabase[stock]);
            }
        }
    }
    else if(!symbol && min && !max){
        for (const stock in stockDatabase){
            if(stockDatabase[stock].quote >= min){
                data.push(stockDatabase[stock]);
            }
        }
    }

    else if(symbol && !min &&!max) {
        for (const stock in stockDatabase){
            if(stock.includes(symbol)){
                data.push(stockDatabase[stock]);
            }
        }
    }

    else if(symbol && min && !max){
        for (const stock in stockDatabase){
            if(stock.includes(symbol) && stockDatabase[stock].quote >= min){
                data.push(stockDatabase[stock]);
            }
        }
    }

    else if(symbol && !min && max){
        for (const stock in stockDatabase){
            if(stock.includes(symbol) && stockDatabase[stock].quote <= max){
                data.push(stockDatabase[stock]);
            }
        }
    }

    else if(symbol && min && max){
        for (const stock in stockDatabase){
            if(stock.includes(symbol) && stockDatabase[stock].quote <= max && stockDatabase[stock].quote >= min){
                data.push(stockDatabase[stock]);
            }
        }
    }

    res.write(JSON.stringify(data, null, 2));
    res.end();
});

app.get("/stocks/userActivity", (req, res) =>{
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let symbol = req.query.symbol? req.query.symbol.toUpperCase() : undefined;
    if (!stockDatabase[symbol]){
        res.write("<h3>This stock symbol doesn't exist in our database or you have entered an incorrect param.</h3>");
        res.end();
        return;
    }
    let data = [];
    const userDatabase = JSON.parse(fs.readFileSync("../database/users/users.json"));

    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    if(!startDate&& !endDate){
        for (const username in userDatabase){

            userDatabase[username].activity.forEach(activity =>{
                    if (activity.date === today){
                        activity.activities.forEach(action =>{
                            if (action.message.includes(symbol)){
                                data.push(  {username: username, action: action.message}  );
                            }
                        });
                    }
            });
        }
    }
    else if(startDate && !endDate){
        for (const username in userDatabase){

            userDatabase[username].activity.forEach(activity =>{
                    if (activity.date >= startDate){
                        activity.activities.forEach(action =>{
                            if (action.message.includes(symbol)){
                                data.push(  {username: username, action: action.message}  );
                            }
                        });
                    }
            });
        }
    }
    else if(!startDate && endDate){
        for (const username in userDatabase){

            userDatabase[username].activity.forEach(activity =>{
                    if (activity.date <= endDate){
                        activity.activities.forEach(action =>{
                            if (action.message.includes(symbol)){
                                data.push(  {username: username, action: action.message}  );
                            }
                        });
                    }
            });
        }
    }
    else if(startDate && endDate){
        for (const username in userDatabase){

            userDatabase[username].activity.forEach(activity =>{
                    if (activity.date <= endDate && activity.date >= startDate){
                        activity.activities.forEach(action =>{
                            if (action.message.includes(symbol)){
                                data.push(  {username: username, action: action.message}  );
                            }
                        });
                    }
            });
        }
    }

    res.write(JSON.stringify({symbol: symbol, action: data}, null, 2));
    res.end();
});

app.get("/stocks/history", (req, res) => {
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let symbol = req.query.symbol? req.query.symbol.toUpperCase(): undefined;
    if (!stockDatabase[symbol]){
        res.write("<h3>This stock symbol doesn't exist in our database or you have entered an incorrect param.</h3>");
        res.end();
        return;
    }

    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    let data = [];

    if (!startDate && !endDate) {
        data.push({
            date: today,
            symbol: symbol,
            daily_range: stockDatabase[symbol].daily_range,
            currentPrice: stockDatabase[symbol].quote,
            prevClose: stockDatabase[symbol].prev_close,
            volume: stockDatabase[symbol].volume
        });
    }
    else if(startDate && !endDate){
        for (const date in stockDatabase[symbol].historical){
            if (date >= startDate){
                data.push({
                    date: date,
                    symbol: symbol,
                    daily_range: stockDatabase[symbol].historicalDailyRange[date],
                    closingPrice: stockDatabase[symbol].historical[date],
                    volume: stockDatabase[symbol].historicalVolume[date]
                });
            }
        }
    }
    else if(startDate && endDate){
        for (const date in stockDatabase[symbol].historical){
            if (date >= startDate && date <= endDate){
                data.push({
                    date: date,
                    symbol: symbol,
                    daily_range: stockDatabase[symbol].historicalDailyRange[date],
                    closingPrice: stockDatabase[symbol].historical[date],
                    volume: stockDatabase[symbol].historicalVolume[date]
                });
            }
        }
    }
    res.setHeader("Content-Type", "application/JSON");
    if(req.query.symbol === null) {
      for (const stock in stockDatabase) {
        data.push(stockDatabase[stock]);
    }
  }
  res.write(JSON.stringify(data, null, 2));
  res.end();
});

/**********************************************
 Server Information
********************************************* */
setInterval(function checkRefresh() {
    if(today !== new Date().toISOString().slice(0,10)) {
        serverReset.resetStock(today);
        serverReset.resetOpenOrders();
        today = new Date().toISOString().slice(0,10);
        console.log("----server reseted----");
    }
}, 10000);
app.listen(3001);

    console.log('Please ensure the react-app is running and navigate to http://127.0.0.1:3000/');
    console.log('If using Carleton network please navigate to http://127.0.0.1:9999/ once the react-app is running.\n');
