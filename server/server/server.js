const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const session=require('express-session');
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

/********************************************** 
    Helper Functions
     - handles: 
        - checking for valid sessions
        - updating data base  (currently JSON files)
        - creating open sell and buy orders
        - validating sell and buy Post requests
**********************************************/

function isSessionValid(s, u){
    if(s && u){
        return true;
    }
    return false;
}

function updateUserDataBase(){    
    fs.writeFileSync("../database/users/users.json", JSON.stringify(users, null, 2));
}

function updateBuyOrdersData(d){
    fs.writeFileSync("../database/orders/openBuyOrders.json", JSON.stringify(d, null, 2));
}

function updateSellOrdersData(d){
    fs.writeFileSync("../database/orders/openSellOrders.json", JSON.stringify(d, null, 2));
}

function createOpenOrder(name, quote, symbol, quantity, orderType, orderId, username, limitPrice){
    let date = new Date();
        
        let openOrder = {
          name: name,
          quote: quote,
          symbol: symbol,
          share: parseInt(quantity),
          orderType: orderType,
          orderId: orderId,
          username: username,
          date: date,
          limitPrice: limitPrice
        };   
        
    return openOrder;
}

function updateInvestmentBalance(username){
    //reset to 0
    users[username].account.investmentBalance = 0;
    for (let i = 0; i < users[username]['ownedStocks'].length; i++){
        users[username].account.investmentBalance += users[username]['ownedStocks'][i].total_cost;
    }
}

function validateBuy(quantity, symbol, limitPrice, user) {
    
    let sellOrderArr = JSON.parse(fs.readFileSync("../database/orders/openSellOrders.json"));
    let buyOrderArr = JSON.parse(fs.readFileSync("../database/orders/openBuyOrders.json"));
    let stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));

    let currentQuantity = parseInt(quantity);
    
    for(let i = 0; i < sellOrderArr.length; i++) {
        
        if(symbol === sellOrderArr[i].symbol 
            && sellOrderArr[i].username !== user 
            && sellOrderArr[i].limitPrice <= limitPrice 
            && sellOrderArr[i].share >= currentQuantity) {

            
            updateBuyerAccount();    
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: sellOrderArr[i].limitPrice,
                    total_cost: sellOrderArr[i].limitPrice*currentQuantity,
                    average_cost: sellOrderArr[i].limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: currentQuantity      
                };

                //Update Buyer Balance and Holding
                users[user]['account']["cashBalance"] 
                -= (sellOrderArr[i].limitPrice * currentQuantity);
            

                users[user]['activity'].push(
                    `Bought ${currentQuantity} shares of ${symbol} at $${sellOrderArr[i].limitPrice} from ${sellOrderArr[i].username}`
                );                      

                for (let j = 0; j < users[user]['ownedStocks'].length; j++) {

                    if(users[user]['ownedStocks'][j].symbol === newStock.symbol) {

                        users[user]['ownedStocks'][j].share 
                        += currentQuantity;

                        users[user]['ownedStocks'][j].total_cost 
                        += newStock.quote * currentQuantity;

                        users[user]['ownedStocks'][j].average_cost 
                        = (users[user]['ownedStocks'][j].total_cost / users[user]['ownedStocks'][j].share);                    
                        
                        return;
                    }                               
                } 
                users[user]['ownedStocks'].push(newStock);           
                
            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding            
                users[sellOrderArr[i]['username']]
                ['account']["cashBalance"] +=  (sellOrderArr[i].limitPrice * currentQuantity);           
     
                users[sellOrderArr[i]['username']]
                ['activity'].push(`Sold ${currentQuantity} shares of ${symbol} at $${sellOrderArr[i].limitPrice} to ${user}`);

                for(let k = 0; k < users[sellOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    if(users[sellOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === sellOrderArr[i].symbol) {
                        users[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] -= currentQuantity;
                        
                        if(users[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] === 0) {
                            users[sellOrderArr[i]['username']]['ownedStocks'].splice(k, 1);
                        }
                        break;
                    }
                }
                
                for(let k = 0; k < users[sellOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(users[sellOrderArr[i]['username']]['openOrders'][k]['orderId'] === sellOrderArr[i].orderId) {

                        users[sellOrderArr[i]['username']]['openOrders'][k]['share'] -= currentQuantity;

                        if(users[sellOrderArr[i]['username']]['openOrders'][k]['share'] === 0) {
                            users[sellOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        } 

                        break;
                    }
                }

                updateInvestmentBalance(sellOrderArr[i]['username']);

                
            
            }          
                //decrement share total for partially fufilled sell order
                sellOrderArr[i].share -= currentQuantity;
                currentQuantity = 0;
                break;
                
        }

        else if(symbol === sellOrderArr[i].symbol 
            && sellOrderArr[i].limitPrice >= limitPrice 
            && sellOrderArr[i].username !== user 
            && 0 < sellOrderArr[i].share < currentQuantity) {
                
            

            updateBuyerAccount();              
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: sellOrderArr[i].limitPrice,
                    total_cost: sellOrderArr[i].limitPrice*sellOrderArr[i].share,
                    average_cost: sellOrderArr[i].limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: sellOrderArr[i].share      
                };

                //Update Buyer Balance and Holding
                users[user]['account']["cashBalance"] 
                -= (sellOrderArr[i].limitPrice * sellOrderArr[i].share);    
                users[user]['activity'].push(
                    `Bought ${sellOrderArr[i].share} shares of ${symbol} at $${sellOrderArr[i].limitPrice} from ${sellOrderArr[i].username}`
                );                 
              

                for (let j = 0; j < users[user]['ownedStocks'].length; j++) {

                    if(users[user]['ownedStocks'][j].symbol === newStock.symbol) {

                        users[user]['ownedStocks'][j].share 
                        += sellOrderArr[i].share;

                        users[user]['ownedStocks'][j].total_cost 
                        += newStock.quote * sellOrderArr[i].share;

                        users[user]['ownedStocks'][j].average_cost 
                        = (users[user]['ownedStocks'][j].total_cost / users[user]['ownedStocks'][j].share);                    
                        
                        return;
                    }                               
                } 
                users[user]['ownedStocks'].push(newStock);           
                
            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding            
                users[sellOrderArr[i]['username']]
                ['account']["cashBalance"] +=  (sellOrderArr[i].limitPrice * sellOrderArr[i].share);    
                users[sellOrderArr[i]['username']]
                ['activity'].push(`Sold ${sellOrderArr[i].share} shares of ${symbol} at $${sellOrderArr[i].limitPrice} to ${user}`);

                for(let k = 0; k < users[sellOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    if(users[sellOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === sellOrderArr[i].symbol) {
                        users[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] -= sellOrderArr[i].share;                        
                        if(users[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] === 0) {
                            users[sellOrderArr[i]['username']]['ownedStocks'].splice(k, 1);
                        }
                        break;
                    }
                }
                
                for(let k = 0; k < users[sellOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(users[sellOrderArr[i]['username']]['openOrders'][k]['orderId'] === sellOrderArr[i].orderId) {
                        users[sellOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        break;                         
                    }
                }    
                
                updateInvestmentBalance(sellOrderArr[i]['username']);
                
                

            }
            currentQuantity -= sellOrderArr[i].share;
            sellOrderArr[i].share = 0;
        }             
    }

    

    if (currentQuantity > 0){
        let name = stockDatabase[symbol].name;
        let quote = stockDatabase[symbol].quote;
        let orderType = 'buy';
        let orderId = uuidv4();
        let username = user    

        let newOpenOrder = createOpenOrder(name, quote, symbol, currentQuantity, orderType, orderId, username, limitPrice);
        
        buyOrderArr.push(newOpenOrder);
        users[user]["openOrders"].push(newOpenOrder);       
        
    }

    
    let updatedSellOrderArr = sellOrderArr.filter(function (order) {
        return order.share > 0
    });

    updateInvestmentBalance(user);
    updateSellOrdersData(updatedSellOrderArr);
    updateBuyOrdersData(buyOrderArr);        
    updateUserDataBase();

    
}

function validateSell(quantity, symbol, limitPrice, user) {

    let buyOrderArr = JSON.parse(fs.readFileSync("../database/orders/openBuyOrders.json"))
    let sellOrderArr = JSON.parse(fs.readFileSync("../database/orders/openSellOrders.json"));;
    let stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));

    let currentQuantity = parseInt(quantity);
    
    
    for(let i = 0; i < buyOrderArr.length; i++) {

        if(symbol === buyOrderArr[i].symbol  && buyOrderArr[i].limitPrice >= limitPrice && buyOrderArr[i].username !== user &&  buyOrderArr[i].share >= currentQuantity) {
                   
            updateSellerAccount();    
            function updateSellerAccount(){

                //Update Buyer Balance and Holding
                users[user]['account']["cashBalance"] 
                += (buyOrderArr[i].limitPrice * currentQuantity);               

                users[user]['activity'].push(

                    `Sold ${currentQuantity} shares of ${symbol} at $${buyOrderArr[i].limitPrice} to ${buyOrderArr[i].username}`

                );

                for (let j = 0; i < users[user]['ownedStocks'].length; j++) {

                    if(users[user]['ownedStocks'][j].symbol === symbol) {

                        users[user]['ownedStocks'][j].share 
                        -= currentQuantity;                    

                        users[user]['ownedStocks'][j].total_cost 
                        -= (buyOrderArr[i].limitPrice * currentQuantity);

                        users[user]['ownedStocks'][j].average_cost 
                        = (users[user]['ownedStocks'][j].total_cost / users[user]['ownedStocks'][j].share);    
                        
                        if (users[user]['ownedStocks'][j].share === 0){
                            users[user]['ownedStocks'].splice(j, 1);
                        }
                        return;
                    }                               
                } 
            }

            updateBuyerAccount();
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: buyOrderArr[i].limitPrice,
                    total_cost: buyOrderArr[i].limitPrice*currentQuantity,
                    average_cost: buyOrderArr[i].limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: currentQuantity      
                };

                //Update Buyer Balance and Holding            
                users[buyOrderArr[i]['username']]
                ['account']["cashBalance"] -=  (buyOrderArr[i].limitPrice * currentQuantity);
                users[buyOrderArr[i]['username']]               
                ['activity'].push(`Bought ${currentQuantity} shares of ${symbol} at $${buyOrderArr[i].limitPrice} from ${user}`);

                for(let k = 0; k < users[buyOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(users[buyOrderArr[i]['username']]['openOrders'][k]['orderId'] === buyOrderArr[i].orderId) {
                        users[buyOrderArr[i]['username']]['openOrders'][k]['share'] -= currentQuantity;
                        if(users[buyOrderArr[i]['username']]['openOrders'][k]['share'] === 0) {
                            users[buyOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        } 
                    }
                }                

                for(let k = 0; k < users[buyOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    //if user owns stock, and is adding more shares
                    if(users[buyOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === buyOrderArr[i].symbol) {
                        users[buyOrderArr[i]['username']]['ownedStocks'][k]['share'] += currentQuantity;                                                 
                        return;
                    } 
                }                                             
                users[buyOrderArr[i]['username']]['ownedStocks'].push(newStock);              
                               
               
            }
            //decrement share total for partially fufilled sell order
            buyOrderArr[i].share -= currentQuantity;    
            currentQuantity = 0;
            updateInvestmentBalance(buyOrderArr[i]['username']);   
            break;           
                
        }

        else if(symbol === buyOrderArr[i].symbol && buyOrderArr[i].limitPrice >= limitPrice && buyOrderArr[i].username !== user && 0 < buyOrderArr[i].share < currentQuantity) {
            currentQuantity -= buyOrderArr[i].share;

            updateSellerAccount();
            function updateSellerAccount(){                

                //Update Buyer Balance and Holding
                users[user]['account']["cashBalance"] 
                += (buyOrderArr[i].limitPrice * buyOrderArr[i].share);
            

                users[user]['activity'].push(

                    `Sold ${buyOrderArr[i].share} shares of ${symbol} at $${buyOrderArr[i].limitPrice} to ${buyOrderArr[i].username}`

                );

                for (let j = 0; i < users[user]['ownedStocks'].length; j++) {

                    if(users[user]['ownedStocks'][j].symbol === symbol) {

                        users[user]['ownedStocks'][j].share -= buyOrderArr[i].share;                    

                        users[user]['ownedStocks'][j].total_cost -= (buyOrderArr[i].limitPrice * buyOrderArr[i].share);

                        users[user]['ownedStocks'][j].average_cost 
                        = (users[user]['ownedStocks'][j].total_cost / users[user]['ownedStocks'][j].share);    
                        
                        if (users[user]['ownedStocks'][j].share === 0){
                            users[user]['ownedStocks'].splice(j, 1);
                        }
                        return;
                    }                               
                }
                
                
            }

            updateBuyerAccount();            
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: buyOrderArr[i].limitPrice,
                    total_cost: buyOrderArr[i].limitPrice*buyOrderArr[i].share,
                    average_cost: buyOrderArr[i].limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: buyOrderArr[i].share      
                };               

                //Update Buyer Balance and Holding            
                users[buyOrderArr[i]['username']]['account']["cashBalance"] 
                -=  (buyOrderArr[i].limitPrice * buyOrderArr[i].share);
                              
                users[buyOrderArr[i]['username']]['activity']
                .push(`Bought ${buyOrderArr[i].share} shares of ${symbol} at $${buyOrderArr[i].limitPrice} from ${user}`);

                for(let k = 0; k < users[buyOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(users[buyOrderArr[i]['username']]['openOrders'][k]['orderId'] === buyOrderArr[i].orderId) {
                        users[buyOrderArr[i]['username']]['openOrders'].splice(k, 1);
                    }                    
                }               
                
                
                for(let k = 0; k < users[buyOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    //if user owns stock, and is adding more shares
                    if(users[buyOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === buyOrderArr[i].symbol) {
                        users[buyOrderArr[i]['username']]['ownedStocks'][k]['share'] += buyOrderArr[i].share;
                        
                        return;                        
                    } 
                }                
                
                users[buyOrderArr[i]['username']]['ownedStocks'].push(newStock);               
                             
            }

            updateInvestmentBalance(buyOrderArr[i]['username']);   
            buyOrderArr.splice(i, 1);
        }        
    }

    if (currentQuantity > 0){
        let name = stockDatabase[symbol].name;
        let quote = stockDatabase[symbol].quote;
        let orderType = 'sell';
        let orderId = uuidv4();
        let username = user    

        let newOpenOrder = createOpenOrder(name, quote, symbol, currentQuantity, orderType, orderId, username, limitPrice);
        
        sellOrderArr.push(newOpenOrder);
        users[user]["openOrders"].push(newOpenOrder);       
    }

    let updatedBuyOrderArr = buyOrderArr.filter(function (order) {
        return order.share > 0
    });

    updateInvestmentBalance(user);
    updateSellOrdersData(sellOrderArr);
    updateBuyOrdersData(updatedBuyOrderArr);        
    updateUserDataBase();
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
        if(users[username] !== null && users[username]['password'] === password) {
            console.log(`Client ${username} authenticated succesfully.`);
            const USER_TOKEN = uuidv4();
            req.session.user = users[username]['username'];

            users[username]['session_id'] = USER_TOKEN;
            const login_data = {
                authentication: true,
                session_id: USER_TOKEN
            };
            res.write(JSON.stringify(login_data));
        }
        else if(username === '' && password === '') {
            res.write('onload');
        }
        else {
            res.write("false");
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

/********************************************** 
    Account Post and Get Requests:
     - handles a user: 
        - checking their current balance  
        - checking their account information
        - updating their balance on a withdrawl or deposit 
**********************************************/

app.get('/getBalance', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = users[username]['account']['cashBalance'];
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/JSON");
        console.log(`\nClient ${users[req.session.user].username} balance info sent.\n`)
        res.write(data.toString());
        res.end();
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

app.post('/updateBalance', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
            handleTransac(data);
        });
        req.on('end', () => {
        console.log(`\nClient ${users[req.session.user].username} balance updated to ${data}.\n`)
        updateUserDataBase();
        res.end();
        });

        function handleTransac(data) {
        if(data.type === 'deposit') {
            users[req.session.user]['account']['cashBalance'] += parseInt(data.amount);
        }
        else {
            if(users[req.session.user]['account']['cashBalance'] >= parseInt(data.amount)) {
            users[req.session.user]['account']['cashBalance'] -= parseInt(data.amount);
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
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });
        req.on('end', () => {

            let stockData = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
            let stock = stockData[data.value];

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
});

 app.post('/addEventNotify', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });
        req.on('end', () => {

            let stockData = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
            let stock = stockData[data];

            let eventItem = {
                symbol: stock.symbol,
                quote: stock.quote,
                name: stock.name,
                active: true,
                notify_num: data.num
            };

            let isItemInList = false;
            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i] === eventItem) {
                    isItemInList = true;
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
                if(users[req.session.user]['eventList'][i]['symbol'] === data) {
                    users[req.session.user]['eventList'].splice(i, 1);
                } 
            }
            updateUserDataBase();
            res.end();
        });
    }
});

app.post('/deactivateEvent', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === data) {
                    users[req.session.user]['eventList'][i]['active'] = false;
                } 
            }
            updateUserDataBase();
            res.end();
        });
    }
});

app.post('/activateEvent', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        let data = "";
        req.on('data', (chunk) => {
            data = JSON.parse(chunk);
        });

        req.on('end', () => {

            for(let i = 0; i < users[req.session.user]['eventList'].length; i++) {
                if(users[req.session.user]['eventList'][i]['symbol'] === data) {
                    users[req.session.user]['eventList'][i]['active'] = true;
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
                    users[req.session.user]['eventList'][i]['num'] = data.num;
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
                    if (users[req.session.user]['openOrders'][j]['symbol'] === symbol){
                        sum += users[req.session.user]['openOrders'][j]['share'] * users[req.session.user]['openOrders'][j]['share'];
                    }
                }

                if (users[req.session.user]['account']['cashBalance'] - sum >= 0){
                    validateBuy(quantity, symbol, limitPrice, users[req.session.user]['username']);
                    return;
                }                
            }                           
            
            console.log(`User: ${users[req.session.user]['username']} does not have the required amount of cash balance to complete this sale.`);

        }
        
    }
});

app.post('/sellStock', (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
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
                        if (users[req.session.user]['openOrders'][j]['symbol'] === symbol){
                            sum += users[req.session.user]['openOrders'][j]['share'];
                        }
                    }

                    if (users[req.session.user]['ownedStocks'][i]['share'] - sum >= quantity){
                        validateSell(quantity, symbol, limitPrice, users[req.session.user]['username']);
                        return;
                    }
                    
                }
            }
            console.log(`User: ${users[req.session.user]['username']} does not have the required stock or amount of shares to complete this sale.`);
        }
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
        fs.readFile("../database/stocks/data.json", function(err, file){
            let lis = JSON.parse(file);
            let data = [];
            res.setHeader("Content-Type", "application/JSON");
            for(let j = 0; j < users[req.session.user]['watchlist'].length; j++) {
            let item = users[req.session.user]['watchlist'][j];
            data.push(lis[item]);
            }
            res.write(JSON.stringify(data));
            updateUserDataBase();
            res.end();
        });
    }
  });

app.get('/pop-stock-data', (req, res) => {
    
    let stockData = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let data = [];

    //this will eventually give popular stocks by volume! We need more data!!
    data.push(stockData['AMD']);
    data.push(stockData['SE']);
    data.push(stockData['FB']);    
    
    if (isSessionValid(req.session, req.session.user)){
        res.setHeader("Content-Type", "application/JSON");
        res.write(JSON.stringify(data));
        res.end();
    }
  });


app.get("/stock-data", (req, res) => {
    if (isSessionValid(req.session, req.session.user)){
        fs.readFile("../database/stocks/data.json", function(err, file){
            let search = req.query['search'];
            let lis = JSON.parse(file);
            let data = [];
            res.setHeader("Content-Type", "application/JSON");
            if(lis[search] != null) {
                data.push(lis[search]);
            }
            res.write(JSON.stringify(data));
            res.end();
            });
    }
});

/********************************************** 
 Server Information 
********************************************* */
app.listen(3001);
console.log('\nServer running at http://127.0.0.1:3001/');
console.log('Please ensure the react-app is running and navigate to http://127.0.0.1:3000/');
console.log('If using Carleton network please navigate to http://127.0.0.1:9999/ once the react-app is running.\n');
