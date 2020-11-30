const fs = require("fs");
const stockOrder = require("./stockOrder.js");

module.exports = {
    resetStock,
    resetOpenOrders
 }

 function resetStock(){
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    let date = new Date();
    let today = date.toISOString().slice(0,10);
    for (const stock in stockDatabase){
        stockDatabase[stock].volume = 0;
        stockDatabase[stock].precentage = 0;
        stockDatabase[stock].prev_close =  stockDatabase[stock].quote;
        stockDatabase[stock].totalTranscationAmount = 0;
        stockDatabase[stock].historical[today] = stockDatabase[stock].quote;
        stockDatabase[stock].daily_range.high = 0;
        stockDatabase[stock].daily_range.low = 0;
    }

    stockOrder.updateStockDatabase(stockDatabase);
 }

 function resetOpenOrders(){
    const users = JSON.parse(fs.readFileSync("../database/users/users.json"));
    for(const username in users){
        delete users[username].openOrders;
        users[username].openOrders = [];
    }
    stockOrder.updateUserDataBase(users);
    let sellOrderArr = [];
    let buyOrderArr = [];
    stockOrder.updateSellOrdersData(sellOrderArr);
    stockOrder.updateBuyOrdersData(buyOrderArr);
 }
