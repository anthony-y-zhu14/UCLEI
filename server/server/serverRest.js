const fs = require("fs");
const stockOrder = require("./stockOrder.js");

module.exports = {
    resetStock,
    resetOpenOrders
 }

 function resetStock(yesterday){
    const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
    for (const stock in stockDatabase){
        stockDatabase[stock].prev_close =  stockDatabase[stock].quote;
        stockDatabase[stock].totalTranscationAmount = 0;
        stockDatabase[stock].historical[yesterday] = stockDatabase[stock].quote;
        stockDatabase[stock].historicalVolume[yesterday] = stockDatabase[stock].volume;
        stockDatabase[stock].historicalDailyRange[yesterday] = stockDatabase[stock].daily_range;
        stockDatabase[stock].daily_range.high = stockDatabase[stock].prev_close;
        stockDatabase[stock].daily_range.low = stockDatabase[stock].prev_close;
        stockDatabase[stock].volume = 0;
        stockDatabase[stock].percentage = 0;
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
