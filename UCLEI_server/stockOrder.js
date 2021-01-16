const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

module.exports = {  
    createOpenOrder,
    creatNewActivity,
    updateInvestmentBalance,
    updateUserActivity,
    updateStockDatabase,
    updateUserDataBase,
    validateBuy,
    validateSell,
    updateBuyOrdersData,
    updateSellOrdersData,
    cancelOrder
 }
function cancelOrder(orderId, user){

    let sellOrderArr = JSON.parse(fs.readFileSync("./database/orders/openSellOrders.json"));
    let buyOrderArr = JSON.parse(fs.readFileSync("./database/orders/openBuyOrders.json"));

    for (let index = 0; index < user.openOrders.length; index++){
        if(user.openOrders[index].orderId === orderId){
            user.openOrders.splice(index, 1);            
            break;
        }
    }

    for (let index = 0; index < sellOrderArr.length; index++){
        if(sellOrderArr[index].orderId === orderId){
            sellOrderArr.splice(index, 1);
            break;
        }
    }

    for (let index = 0; index < buyOrderArr.length; index++){
        if(buyOrderArr[index].orderId === orderId){
            buyOrderArr.splice(index, 1);
            break;
        }
    }

    updateBuyOrdersData(buyOrderArr);
    updateSellOrdersData(sellOrderArr);
}

function creatNewActivity(action, message){
    let date = new Date();
    let today = date.toISOString().slice(0,10);

    message = message + " - " + date.toISOString().slice(0,10);

    let newActivity = {
        date: today,
        action: action,
        message: message
    }

    return newActivity;
}

function createOpenOrder(name, quote, symbol, quantity, orderType, orderId, username, limitPrice){
    let date = new Date();
    let today = date.toISOString().slice(0,10);

        let openOrder = {
          name: name,
          quote: quote,
          symbol: symbol,
          share: parseInt(quantity),
          orderType: orderType,
          orderId: orderId,
          username: username,
          date: today,
          limitPrice: limitPrice
        };

    return openOrder;
}

function updateUserActivity(activityArr, newActivity, stockSymbol){

    for (let index = 0; index < activityArr.length; index++) {      

        let activityDate = activityArr[index];

        if (activityDate.date === newActivity.date){
            activityDate.activities.push(newActivity);
            return;
        }        
    }

    let newActivityDate = {
        date: newActivity.date,
        stock: stockSymbol,
        activities: []
    }

    newActivityDate.activities.push(newActivity);
    activityArr.push(newActivityDate);

}

function updateInvestmentBalance(user, stockDatabase){
    //reset to 0
    user.account.investmentBalance = 0;
    for (let i = 0; i < user.ownedStocks.length; i++){
        user.account.investmentBalance += user.ownedStocks[i].share * stockDatabase[user.ownedStocks[i].symbol].quote;
    }

}

function validateBuy(quantity, symbol, limitPrice, buyerUserName, usersDataBase, stockDatabase) {

    let sellOrderArr = JSON.parse(fs.readFileSync("./database/orders/openSellOrders.json"));
    let buyOrderArr = JSON.parse(fs.readFileSync("./database/orders/openBuyOrders.json"));
    let currentQuantity = parseInt(quantity);

    for(let i = 0; i < sellOrderArr.length; i++) {

        let sellOrder = sellOrderArr[i];

        if(symbol === sellOrder.symbol  && sellOrder.username !== buyerUserName  && sellOrder.limitPrice <= limitPrice
            && sellOrder.share >= currentQuantity) {
                

            
            stockDatabase[symbol].totalTranscationAmount += (sellOrder.limitPrice * currentQuantity);


            updateBuyerAccount();
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: sellOrder.limitPrice,
                    total_cost: sellOrder.limitPrice * currentQuantity,
                    average_cost: sellOrder.limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: currentQuantity
                };

                //Update Buyer Balance and Holding
                usersDataBase[buyerUserName].account.cashBalance -= (sellOrder.limitPrice * currentQuantity);
                

                let activityMessage = `Bought ${currentQuantity} shares of ${symbol} at $${sellOrder.limitPrice} from ${sellOrder.username}`;
                let newActivity = creatNewActivity('buy', activityMessage);

                updateUserActivity(usersDataBase[buyerUserName].activity, newActivity);

                for (let j = 0; j < usersDataBase[buyerUserName].ownedStocks.length; j++) {

                    if(usersDataBase[buyerUserName].ownedStocks[j].symbol === newStock.symbol) {

                        usersDataBase[buyerUserName].ownedStocks[j].share += currentQuantity;

                        usersDataBase[buyerUserName].ownedStocks[j].total_cost += newStock.quote * currentQuantity;

                        usersDataBase[buyerUserName].ownedStocks[j].average_cost = parseFloat((usersDataBase[buyerUserName]['ownedStocks'][j].total_cost / usersDataBase[buyerUserName]['ownedStocks'][j].share).toFixed(2));

                        return;
                    }
                }
                usersDataBase[buyerUserName].ownedStocks.push(newStock);

            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding
                usersDataBase[sellOrder.username].account.cashBalance += (sellOrder.limitPrice * currentQuantity);

                let activityMessage = `Sold ${currentQuantity} shares of ${symbol} at $${sellOrder.limitPrice} to ${buyerUserName}`;
                let newActivity = creatNewActivity('sell', activityMessage);

                updateUserActivity(usersDataBase[sellOrder.username].activity, newActivity);

                for(let k = 0; k < usersDataBase[sellOrder.username].ownedStocks.length; k++) {
                    if(usersDataBase[sellOrder.username].ownedStocks[k].symbol === sellOrder.symbol) {

                        usersDataBase[sellOrder.username].ownedStocks[k].share -= currentQuantity;

                        if(usersDataBase[sellOrder.username].ownedStocks[k].share === 0) {
                            usersDataBase[sellOrder.username].ownedStocks.splice(k, 1);
                        }
                        break;
                    }
                }

                for(let k = 0; k < usersDataBase[sellOrder.username].openOrders.length; k++) {
                    if(usersDataBase[sellOrder.username].openOrders[k].orderId === sellOrder.orderId) {

                        usersDataBase[sellOrder.username].openOrders[k].share -= currentQuantity;

                        if(usersDataBase[sellOrder.username].openOrders[k].share === 0) {
                            usersDataBase[sellOrder.username].openOrders.splice(k, 1);
                        }

                        break;
                    }
                }

                updateInvestmentBalance(usersDataBase[sellOrder.username], stockDatabase);



            }
            //decrement share total for partially fufilled sell order
            sellOrder.share -= currentQuantity;
            currentQuantity = 0;
            
            break;

        }

        else if(symbol === sellOrder.symbol  && sellOrder.limitPrice <= limitPrice  && sellOrder.username !== buyerUserName  && 0 < sellOrder.share < currentQuantity) {


            stockDatabase[symbol].totalTranscationAmount += (sellOrder.limitPrice * sellOrder.share);

            updateBuyerAccount();
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: sellOrder.limitPrice,
                    total_cost: sellOrder.limitPrice*sellOrder.share,
                    average_cost: sellOrder.limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: sellOrder.share
                };

                //Update Buyer Balance and Holding
                usersDataBase[buyerUserName]['account']["cashBalance"] -= (sellOrder.limitPrice * sellOrder.share);

                let activityMessage =  `Bought ${sellOrder.share} shares of ${symbol} at $${sellOrder.limitPrice} from ${sellOrder.username}`;
                let newActivity = creatNewActivity('buy', activityMessage);

                updateUserActivity(usersDataBase[buyerUserName].activity, newActivity);

                for (let j = 0; j < usersDataBase[buyerUserName].ownedStocks.length; j++) {

                    if(usersDataBase[buyerUserName].ownedStocks[j].symbol === newStock.symbol) {

                        usersDataBase[buyerUserName].ownedStocks[j].share += sellOrder.share;

                        usersDataBase[buyerUserName].ownedStocks[j].total_cost += newStock.quote * sellOrder.share;

                        usersDataBase[buyerUserName].ownedStocks[j].average_cost = parseFloat((usersDataBase[buyerUserName].ownedStocks[j].total_cost / usersDataBase[buyerUserName].ownedStocks[j].share).toFixed(2));

                        return;
                    }
                }
                usersDataBase[buyerUserName].ownedStocks.push(newStock);

            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding
                usersDataBase[sellOrder.username].account.cashBalance +=  (sellOrder.limitPrice * sellOrder.share);
                let activityMessage = `Sold ${sellOrder.share} shares of ${symbol} at $${sellOrder.limitPrice} to ${buyerUserName}`;
                let newActivity = creatNewActivity('sell', activityMessage);

                updateUserActivity(usersDataBase[sellOrder.username].activity, newActivity);

                for(let k = 0; k < usersDataBase[sellOrder.username].ownedStocks.length; k++) {
                    if(usersDataBase[sellOrder.username].ownedStocks[k].symbol === sellOrder.symbol) {
                        usersDataBase[sellOrder.username].ownedStocks[k].share -= sellOrder.share;
                        if(usersDataBase[sellOrder.username].ownedStocks[k].share === 0) {
                            usersDataBase[sellOrder.username].ownedStocks.splice(k, 1);
                        }
                        break;
                    }
                }

                for(let k = 0; k < usersDataBase[sellOrder.username].openOrders.length; k++) {
                    if(usersDataBase[sellOrder.username].openOrders[k].orderId === sellOrder.orderId) {
                        usersDataBase[sellOrder.username].openOrders.splice(k, 1);
                        break;
                    }
                }

                updateInvestmentBalance(usersDataBase[sellOrder.username], stockDatabase);
            }
            currentQuantity -= sellOrder.share;
            sellOrder.share = 0;
        }
    }



    if (currentQuantity > 0){
        let name = stockDatabase[symbol].name;
        let quote = stockDatabase[symbol].quote;
        let orderType = 'buy';
        let orderId = uuidv4();
        let username = buyerUserName

        let newOpenOrder = createOpenOrder(name, quote, symbol, currentQuantity, orderType, orderId, username, limitPrice);

        buyOrderArr.push(newOpenOrder);
        usersDataBase[username].openOrders.push(newOpenOrder);

    }


    let updatedSellOrderArr = sellOrderArr.filter(function (order) {
        return order.share > 0
    });

    //update percentage change, quote
    
    if (quantity > currentQuantity){
        stockDatabase[symbol].volume += (quantity - currentQuantity);
        let newQuote = stockDatabase[symbol].totalTranscationAmount / stockDatabase[symbol].volume;
        let percentageChange = ((newQuote - stockDatabase[symbol].prev_close) / stockDatabase[symbol].prev_close * 100);

        stockDatabase[symbol].percentage = parseFloat(percentageChange.toFixed(2));
        stockDatabase[symbol].quote =  parseFloat(newQuote.toFixed(2));
    }


    //update daily low and high
    if(stockDatabase[symbol].quote > stockDatabase[symbol].daily_range.high){
        stockDatabase[symbol].daily_range.high = stockDatabase[symbol].quote;
    }
    if(stockDatabase[symbol].quote < stockDatabase[symbol].daily_range.low){
        stockDatabase[symbol].daily_range.low = stockDatabase[symbol].quote;
    }
    


    updateInvestmentBalance(usersDataBase[buyerUserName], stockDatabase);
    updateSellOrdersData(updatedSellOrderArr);
    updateBuyOrdersData(buyOrderArr);
    updateUserDataBase(usersDataBase);
    updateStockDatabase(stockDatabase);


}

function validateSell(quantity, symbol, limitPrice, sellerUserName, usersDatabase, stockDatabase) {

    let buyOrderArr = JSON.parse(fs.readFileSync("./database/orders/openBuyOrders.json"))
    let sellOrderArr = JSON.parse(fs.readFileSync("./database/orders/openSellOrders.json"))

    let currentQuantity = parseInt(quantity);


    for(let i = 0; i < buyOrderArr.length; i++) {

        let buyOrder = buyOrderArr[i];

        if(symbol === buyOrder.symbol  && buyOrder.limitPrice >= limitPrice && buyOrder.username !== sellerUserName &&  buyOrder.share >= currentQuantity) {
            stockDatabase[symbol].totalTranscationAmount += (buyOrder.limitPrice * currentQuantity);

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Buyer Balance and Holding
                usersDatabase[sellerUserName].account.cashBalance += (buyOrder.limitPrice * currentQuantity);

                let activityMessage = `Sold ${currentQuantity} shares of ${symbol} at $${buyOrder.limitPrice} to ${buyOrder.username}`;

                let newActivity = creatNewActivity('sell', activityMessage);

                updateUserActivity(usersDatabase[sellerUserName].activity, newActivity);

                for (let j = 0; i < usersDatabase[sellerUserName].ownedStocks.length; j++) {

                    if(usersDatabase[sellerUserName].ownedStocks[j].symbol === symbol) {

                        usersDatabase[sellerUserName].ownedStocks[j].share -= currentQuantity;

                        usersDatabase[sellerUserName].ownedStocks[j].total_cost -= (buyOrderArr[i].limitPrice * currentQuantity);

                        usersDatabase[sellerUserName].ownedStocks[j].average_cost = parseFloat((usersDatabase[sellerUserName].ownedStocks[j].total_cost / usersDatabase[sellerUserName].ownedStocks[j].share).toFixed(2));

                        if (usersDatabase[sellerUserName].ownedStocks[j].share === 0){
                            usersDatabase[sellerUserName].ownedStocks.splice(j, 1);
                        }
                        return;
                    }
                }
            }

            updateBuyerAccount();
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: buyOrder.limitPrice,
                    total_cost: buyOrder.limitPrice*currentQuantity,
                    average_cost: buyOrder.limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: currentQuantity
                };

                //Update Buyer Balance and Holding
                usersDatabase[buyOrder.username].account.cashBalance -=  (buyOrder.limitPrice * currentQuantity);

                let activityMessage = `Bought ${currentQuantity} shares of ${symbol} at $${buyOrder.limitPrice} from ${sellerUserName}`;
                let newActivity = creatNewActivity('buy', activityMessage);

                updateUserActivity(usersDatabase[buyOrder.username].activity, newActivity);

                for(let k = 0; k < usersDatabase[buyOrder.username].openOrders.length; k++) {
                    if(usersDatabase[buyOrder.username].openOrders[k].orderId === buyOrder.orderId) {
                        usersDatabase[buyOrder.username].openOrders[k].share -= currentQuantity;
                        if(usersDatabase[buyOrder.username].openOrders[k].share === 0) {
                            usersDatabase[buyOrder.username].openOrders.splice(k, 1);
                        }
                    }
                }

                for(let k = 0; k < usersDatabase[buyOrder.username].ownedStocks.length; k++) {
                    //if user owns stock, and is adding more shares
                    if(usersDatabase[buyOrder.username].ownedStocks[k].symbol === buyOrder.symbol) {
                        usersDatabase[buyOrder.username].ownedStocks[k].share += currentQuantity;
                        return;
                    }
                }
                usersDatabase[buyOrder.username].ownedStocks.push(newStock);


            }
            //decrement share total for partially fufilled sell order
            buyOrder.share -= currentQuantity;
            currentQuantity = 0;
            updateInvestmentBalance(usersDatabase[buyOrder.username], stockDatabase);
            break;

        }

        else if(symbol === buyOrder.symbol && buyOrder.limitPrice >= limitPrice && buyOrder.username !== sellerUserName && 0 < buyOrder.share < currentQuantity) {
            
            stockDatabase[symbol].totalTranscationAmount += (buyOrder.limitPrice * buyOrder.share);

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Buyer Balance and Holding
                usersDatabase[sellerUserName].account.cashBalance += (buyOrder.limitPrice * buyOrder.share);
                
                let activityMessage = `Sold ${buyOrder.share} shares of ${symbol} at $${buyOrder.limitPrice} to ${buyOrder.username}`;
                let newActivity = creatNewActivity('sell', activityMessage);

                updateUserActivity(usersDatabase[sellerUserName].activity, newActivity);

                for (let j = 0; i < usersDatabase[sellerUserName].ownedStocks.length; j++) {

                    if(usersDatabase[sellerUserName].ownedStocks[j].symbol === symbol) {

                        usersDatabase[sellerUserName].ownedStocks[j].share -= buyOrderArr[i].share;

                        usersDatabase[sellerUserName].ownedStocks[j].total_cost -= (buyOrderArr[i].limitPrice * buyOrderArr[i].share);

                        usersDatabase[sellerUserName].ownedStocks[j].average_cost = parseFloat((usersDatabase[sellerUserName].ownedStocks[j].total_cost / usersDatabase[sellerUserName].ownedStocks[j].share).toFixed(2));

                        if (usersDatabase[sellerUserName].ownedStocks[j].share === 0){
                            usersDatabase[sellerUserName].ownedStocks.splice(j, 1);
                        }
                        return;
                    }
                }


            }

            updateBuyerAccount();
            function updateBuyerAccount(){

                let newStock = {
                    name: stockDatabase[symbol].name,
                    quote: buyOrder.limitPrice,
                    total_cost: buyOrder.limitPrice*buyOrder.share,
                    average_cost: buyOrder.limitPrice,
                    symbol: stockDatabase[symbol].symbol,
                    share: buyOrder.share
                };

                //Update Buyer Balance and Holding
                usersDatabase[buyOrder.username].account.cashBalance -=  (buyOrder.limitPrice * buyOrder.share);

                let activityMessage = `Bought ${buyOrder.share} shares of ${symbol} at $${buyOrder.limitPrice} from ${sellerUserName}`;
                let newActivity = creatNewActivity('buy', activityMessage);

                updateUserActivity(usersDatabase[buyOrder.username].activity, newActivity);
                

                for(let k = 0; k < usersDatabase[buyOrder.username].openOrders.length; k++) {
                    if(usersDatabase[buyOrder.username].openOrders[k].orderId === buyOrder.orderId) {
                        usersDatabase[buyOrder.username].openOrders.splice(k, 1);
                    }
                }


                for(let k = 0; k < usersDatabase[buyOrder.username].ownedStocks.length; k++) {
                    //if user owns stock, and is adding more shares
                    if(usersDatabase[buyOrder.username].ownedStocks[k].symbol === buyOrder.symbol) {
                        usersDatabase[buyOrder.username].ownedStocks[k].share += buyOrder.share;

                        return;
                    }
                }

                usersDatabase[buyOrder.username].ownedStocks.push(newStock);

            }
            updateInvestmentBalance(usersDatabase[buyOrderArr[i].username], stockDatabase);
            currentQuantity -= buyOrder.share;
            buyOrder.share = 0;
        }
    }

    if (currentQuantity > 0){
        let name = stockDatabase[symbol].name;
        let quote = stockDatabase[symbol].quote;
        let orderType = 'sell';
        let orderId = uuidv4();
        let username = sellerUserName

        let newOpenOrder = createOpenOrder(name, quote, symbol, currentQuantity, orderType, orderId, username, limitPrice);

        sellOrderArr.push(newOpenOrder);
        usersDatabase[username].openOrders.push(newOpenOrder);
    }

    let updatedBuyOrderArr = buyOrderArr.filter(function (order) {
        return order.share > 0
    });

    if (quantity > currentQuantity){
        stockDatabase[symbol].volume += (quantity - currentQuantity);
        let newQuote = stockDatabase[symbol].totalTranscationAmount / stockDatabase[symbol].volume;
        let percentageChange = ((newQuote - stockDatabase[symbol].prev_close) / stockDatabase[symbol].prev_close * 100);

        stockDatabase[symbol].percentage = parseFloat(percentageChange.toFixed(2));
        stockDatabase[symbol].quote =  parseFloat(newQuote.toFixed(2));
    }

    //update daily low and high
    if(stockDatabase[symbol].quote > stockDatabase[symbol].daily_range.high){
        stockDatabase[symbol].daily_range.high = stockDatabase[symbol].quote;
    }
    if(stockDatabase[symbol].quote < stockDatabase[symbol].daily_range.low){
        stockDatabase[symbol].daily_range.low = stockDatabase[symbol].quote;
    }
    
    updateInvestmentBalance(usersDatabase[sellerUserName], stockDatabase);
    updateSellOrdersData(sellOrderArr);
    updateBuyOrdersData(updatedBuyOrderArr);
    updateUserDataBase(usersDatabase);
    updateStockDatabase(stockDatabase);
}
/*
    Write to buy order database
*/
function updateBuyOrdersData(d){
    fs.writeFileSync("./database/orders/openBuyOrders.json", JSON.stringify(d, null, 2));
}
/*
    Write to sell order database
*/
function updateSellOrdersData(d){
    fs.writeFileSync("./database/orders/openSellOrders.json", JSON.stringify(d, null, 2));
}
/*
    Write to user database
*/
function updateUserDataBase(usersDatabase){
    fs.writeFileSync("./database/users/users.json", JSON.stringify(usersDatabase, null, 2));
}
/*
    Write to stock database
*/
function updateStockDatabase(stockDatabase){
    for(const stock in stockDatabase){
        if (stock !== "D35-C"){
            stockDatabase["D35-C"].volume += stockDatabase[stock].volume;
            stockDatabase["D35-C"].totalTranscationAmount += stockDatabase[stock].totalTranscationAmount;
            stockDatabase["D35-C"].quote += stockDatabase[stock].quote;
        }
    }
    stockDatabase["D35-C"].quote = parseFloat(stockDatabase["D35-C"].quote.toFixed(2));
    stockDatabase["D35-C"].volume = parseFloat(stockDatabase["D35-C"].volume.toFixed(2));
    stockDatabase["D35-C"].totalTranscationAmount = parseFloat(stockDatabase["D35-C"].totalTranscationAmount.toFixed(2));
    let percentageChange = ((stockDatabase["D35-C"].quote - stockDatabase["D35-C"].prev_close) / stockDatabase["D35-C"].prev_close * 100);
    stockDatabase["D35-C"].percentage = parseFloat(percentageChange.toFixed(2));
    stockDatabase["D35-C"].daily_range.high = stockDatabase["D35-C"].quote > stockDatabase["D35-C"].daily_range.high? stockDatabase["D35-C"].quote : stockDatabase["D35-C"].daily_range.high;
    stockDatabase["D35-C"].daily_range.low = stockDatabase["D35-C"].quote < stockDatabase["D35-C"].daily_range.high? stockDatabase["D35-C"].quote : stockDatabase["D35-C"].daily_range.low;
    fs.writeFileSync("./database/stocks/data.json", JSON.stringify(stockDatabase, null, 2))
}

