const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

module.exports = {  
    createOpenOrder,
    updateInvestmentBalance,
    validateBuy,
    validateSell,
    updateBuyOrdersData
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
          date: date.getDate(),
          limitPrice: limitPrice
        };

    return openOrder;
}

function updateInvestmentBalance(user){
    //reset to 0
    user.account.investmentBalance = 0;
    for (let i = 0; i < user.ownedStocks.length; i++){
        user.account.investmentBalance += user.ownedStocks[i].total_cost;
    }

}

function validateBuy(quantity, symbol, limitPrice, buyerUserName, usersDataBase, stockDatabase) {

    let sellOrderArr = JSON.parse(fs.readFileSync("../database/orders/openSellOrders.json"));
    let buyOrderArr = JSON.parse(fs.readFileSync("../database/orders/openBuyOrders.json"));
    let currentQuantity = parseInt(quantity);

    for(let i = 0; i < sellOrderArr.length; i++) {

        if(symbol === sellOrderArr[i].symbol
            && sellOrderArr[i].username !== buyerUserName
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
                usersDataBase[buyerUserName]['account']["cashBalance"]
                -= (sellOrderArr[i].limitPrice * currentQuantity);


                usersDataBase[buyerUserName]['activity'].push(
                    `Bought ${currentQuantity} shares of ${symbol} at $${sellOrderArr[i].limitPrice} from ${sellOrderArr[i].username}`
                );

                for (let j = 0; j < usersDataBase[buyerUserName]['ownedStocks'].length; j++) {

                    if(usersDataBase[buyerUserName]['ownedStocks'][j].symbol === newStock.symbol) {

                        usersDataBase[buyerUserName]['ownedStocks'][j].share
                        += currentQuantity;

                        usersDataBase[buyerUserName]['ownedStocks'][j].total_cost
                        += newStock.quote * currentQuantity;

                        usersDataBase[buyerUserName]['ownedStocks'][j].average_cost
                        = (usersDataBase[buyerUserName]['ownedStocks'][j].total_cost / usersDataBase[buyerUserName]['ownedStocks'][j].share);

                        return;
                    }
                }
                usersDataBase[buyerUserName]['ownedStocks'].push(newStock);

            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding
                usersDataBase[sellOrderArr[i]['username']]
                ['account']["cashBalance"] +=  (sellOrderArr[i].limitPrice * currentQuantity);

                usersDataBase[sellOrderArr[i]['username']]
                ['activity'].push(`Sold ${currentQuantity} shares of ${symbol} at $${sellOrderArr[i].limitPrice} to ${buyerUserName}`);

                for(let k = 0; k < usersDataBase[sellOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    if(usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === sellOrderArr[i].symbol) {
                        usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] -= currentQuantity;

                        if(usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] === 0) {
                            usersDataBase[sellOrderArr[i]['username']]['ownedStocks'].splice(k, 1);
                        }
                        break;
                    }
                }

                for(let k = 0; k < usersDataBase[sellOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(usersDataBase[sellOrderArr[i]['username']]['openOrders'][k]['orderId'] === sellOrderArr[i].orderId) {

                        usersDataBase[sellOrderArr[i]['username']]['openOrders'][k]['share'] -= currentQuantity;

                        if(usersDataBase[sellOrderArr[i]['username']]['openOrders'][k]['share'] === 0) {
                            usersDataBase[sellOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        }

                        break;
                    }
                }

                updateInvestmentBalance(usersDataBase[sellOrderArr[i].username]);



            }
                //decrement share total for partially fufilled sell order
                sellOrderArr[i].share -= currentQuantity;
                currentQuantity = 0;
                break;

        }

        else if(symbol === sellOrderArr[i].symbol
            && sellOrderArr[i].limitPrice >= limitPrice
            && sellOrderArr[i].username !== buyerUserName
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
                usersDataBase[buyerUserName]['account']["cashBalance"]
                -= (sellOrderArr[i].limitPrice * sellOrderArr[i].share);
                usersDataBase[buyerUserName]['activity'].push(
                    `Bought ${sellOrderArr[i].share} shares of ${symbol} at $${sellOrderArr[i].limitPrice} from ${sellOrderArr[i].username}`
                );


                for (let j = 0; j < usersDataBase[buyerUserName]['ownedStocks'].length; j++) {

                    if(usersDataBase[buyerUserName]['ownedStocks'][j].symbol === newStock.symbol) {

                        usersDataBase[buyerUserName]['ownedStocks'][j].share
                        += sellOrderArr[i].share;

                        usersDataBase[buyerUserName]['ownedStocks'][j].total_cost
                        += newStock.quote * sellOrderArr[i].share;

                        usersDataBase[buyerUserName]['ownedStocks'][j].average_cost
                        = (usersDataBase[buyerUserName]['ownedStocks'][j].total_cost / usersDataBase[buyerUserName]['ownedStocks'][j].share);

                        return;
                    }
                }
                usersDataBase[buyerUserName]['ownedStocks'].push(newStock);

            }

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Seller Balance and Holding
                usersDataBase[sellOrderArr[i]['username']]
                ['account']["cashBalance"] +=  (sellOrderArr[i].limitPrice * sellOrderArr[i].share);
                usersDataBase[sellOrderArr[i]['username']]
                ['activity'].push(`Sold ${sellOrderArr[i].share} shares of ${symbol} at $${sellOrderArr[i].limitPrice} to ${buyerUserName}`);

                for(let k = 0; k < usersDataBase[sellOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    if(usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === sellOrderArr[i].symbol) {
                        usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] -= sellOrderArr[i].share;
                        if(usersDataBase[sellOrderArr[i]['username']]['ownedStocks'][k]['share'] === 0) {
                            usersDataBase[sellOrderArr[i]['username']]['ownedStocks'].splice(k, 1);
                        }
                        break;
                    }
                }

                for(let k = 0; k < usersDataBase[sellOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(usersDataBase[sellOrderArr[i]['username']]['openOrders'][k]['orderId'] === sellOrderArr[i].orderId) {
                        usersDataBase[sellOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        break;
                    }
                }

                updateInvestmentBalance(usersDataBase[sellOrderArr[i].username]);



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
        let username = buyerUserName

        let newOpenOrder = createOpenOrder(name, quote, symbol, currentQuantity, orderType, orderId, username, limitPrice);

        buyOrderArr.push(newOpenOrder);
        usersDataBase[username]["openOrders"].push(newOpenOrder);

    }


    let updatedSellOrderArr = sellOrderArr.filter(function (order) {
        return order.share > 0
    });

    stockDatabase[symbol].volume += (quantity - currentQuantity);

    updateInvestmentBalance(usersDataBase[buyerUserName]);
    updateSellOrdersData(updatedSellOrderArr);
    updateBuyOrdersData(buyOrderArr);
    updateUserDataBase(usersDataBase);
    updateStockDatabase(stockDatabase);


}

function validateSell(quantity, symbol, limitPrice, sellerUserName, usersDatabase, stockDatabase) {

    let buyOrderArr = JSON.parse(fs.readFileSync("../database/orders/openBuyOrders.json"))
    let sellOrderArr = JSON.parse(fs.readFileSync("../database/orders/openSellOrders.json"));;

    let currentQuantity = parseInt(quantity);


    for(let i = 0; i < buyOrderArr.length; i++) {

        if(symbol === buyOrderArr[i].symbol  && buyOrderArr[i].limitPrice >= limitPrice && buyOrderArr[i].username !== sellerUserName &&  buyOrderArr[i].share >= currentQuantity) {

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Buyer Balance and Holding
                usersDatabase[sellerUserName]['account']["cashBalance"]
                += (buyOrderArr[i].limitPrice * currentQuantity);

                usersDatabase[sellerUserName]['activity'].push(

                    `Sold ${currentQuantity} shares of ${symbol} at $${buyOrderArr[i].limitPrice} to ${buyOrderArr[i].username}`

                );

                for (let j = 0; i < usersDatabase[sellerUserName]['ownedStocks'].length; j++) {

                    if(usersDatabase[sellerUserName]['ownedStocks'][j].symbol === symbol) {

                        usersDatabase[sellerUserName]['ownedStocks'][j].share
                        -= currentQuantity;

                        usersDatabase[sellerUserName]['ownedStocks'][j].total_cost
                        -= (buyOrderArr[i].limitPrice * currentQuantity);

                        usersDatabase[sellerUserName]['ownedStocks'][j].average_cost
                        = (usersDatabase[sellerUserName]['ownedStocks'][j].total_cost / usersDatabase[sellerUserName]['ownedStocks'][j].share);

                        if (usersDatabase[sellerUserName]['ownedStocks'][j].share === 0){
                            usersDatabase[sellerUserName]['ownedStocks'].splice(j, 1);
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
                usersDatabase[buyOrderArr[i]['username']]
                ['account']["cashBalance"] -=  (buyOrderArr[i].limitPrice * currentQuantity);
                usersDatabase[buyOrderArr[i]['username']]
                ['activity'].push(`Bought ${currentQuantity} shares of ${symbol} at $${buyOrderArr[i].limitPrice} from ${sellerUserName}`);

                for(let k = 0; k < usersDatabase[buyOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(usersDatabase[buyOrderArr[i]['username']]['openOrders'][k]['orderId'] === buyOrderArr[i].orderId) {
                        usersDatabase[buyOrderArr[i]['username']]['openOrders'][k]['share'] -= currentQuantity;
                        if(usersDatabase[buyOrderArr[i]['username']]['openOrders'][k]['share'] === 0) {
                            usersDatabase[buyOrderArr[i]['username']]['openOrders'].splice(k, 1);
                        }
                    }
                }

                for(let k = 0; k < usersDatabase[buyOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    //if user owns stock, and is adding more shares
                    if(usersDatabase[buyOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === buyOrderArr[i].symbol) {
                        usersDatabase[buyOrderArr[i]['username']]['ownedStocks'][k]['share'] += currentQuantity;
                        return;
                    }
                }
                usersDatabase[buyOrderArr[i]['username']]['ownedStocks'].push(newStock);


            }
            //decrement share total for partially fufilled sell order
            buyOrderArr[i].share -= currentQuantity;
            currentQuantity = 0;
            updateInvestmentBalance(usersDatabase[buyOrderArr[i].username]);
            break;

        }

        else if(symbol === buyOrderArr[i].symbol && buyOrderArr[i].limitPrice >= limitPrice && buyOrderArr[i].username !== sellerUserName && 0 < buyOrderArr[i].share < currentQuantity) {
            currentQuantity -= buyOrderArr[i].share;

            updateSellerAccount();
            function updateSellerAccount(){

                //Update Buyer Balance and Holding
                usersDatabase[sellerUserName]['account']["cashBalance"]
                += (buyOrderArr[i].limitPrice * buyOrderArr[i].share);


                usersDatabase[sellerUserName]['activity'].push(

                    `Sold ${buyOrderArr[i].share} shares of ${symbol} at $${buyOrderArr[i].limitPrice} to ${buyOrderArr[i].username}`

                );

                for (let j = 0; i < usersDatabase[sellerUserName]['ownedStocks'].length; j++) {

                    if(usersDatabase[sellerUserName]['ownedStocks'][j].symbol === symbol) {

                        usersDatabase[sellerUserName]['ownedStocks'][j].share -= buyOrderArr[i].share;

                        usersDatabase[sellerUserName]['ownedStocks'][j].total_cost -= (buyOrderArr[i].limitPrice * buyOrderArr[i].share);

                        usersDatabase[sellerUserName]['ownedStocks'][j].average_cost
                        = (usersDatabase[sellerUserName]['ownedStocks'][j].total_cost / usersDatabase[sellerUserName]['ownedStocks'][j].share);

                        if (usersDatabase[sellerUserName]['ownedStocks'][j].share === 0){
                            usersDatabase[sellerUserName]['ownedStocks'].splice(j, 1);
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
                usersDatabase[buyOrderArr[i]['username']]['account']["cashBalance"]
                -=  (buyOrderArr[i].limitPrice * buyOrderArr[i].share);

                usersDatabase[buyOrderArr[i]['username']]['activity']
                .push(`Bought ${buyOrderArr[i].share} shares of ${symbol} at $${buyOrderArr[i].limitPrice} from ${sellerUserName}`);

                for(let k = 0; k < usersDatabase[buyOrderArr[i]['username']]['openOrders'].length; k++) {
                    if(usersDatabase[buyOrderArr[i]['username']]['openOrders'][k]['orderId'] === buyOrderArr[i].orderId) {
                        usersDatabase[buyOrderArr[i]['username']]['openOrders'].splice(k, 1);
                    }
                }


                for(let k = 0; k < usersDatabase[buyOrderArr[i]['username']]['ownedStocks'].length; k++) {
                    //if user owns stock, and is adding more shares
                    if(usersDatabase[buyOrderArr[i]['username']]['ownedStocks'][k]["symbol"] === buyOrderArr[i].symbol) {
                        usersDatabase[buyOrderArr[i]['username']]['ownedStocks'][k]['share'] += buyOrderArr[i].share;

                        return;
                    }
                }

                usersDatabase[buyOrderArr[i]['username']]['ownedStocks'].push(newStock);

            }

            updateInvestmentBalance(usersDatabase[buyOrderArr[i].username]);
            buyOrderArr.splice(i, 1);
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
        usersDatabase[username]["openOrders"].push(newOpenOrder);
    }

    let updatedBuyOrderArr = buyOrderArr.filter(function (order) {
        return order.share > 0
    });

    stockDatabase[symbol].volume += (quantity - currentQuantity);
    updateInvestmentBalance(usersDatabase[sellerUserName]);
    updateSellOrdersData(sellOrderArr);
    updateBuyOrdersData(updatedBuyOrderArr);
    updateUserDataBase(usersDatabase);
    updateStockDatabase(stockDatabase);
}

function updateBuyOrdersData(d){
    fs.writeFileSync("../database/orders/openBuyOrders.json", JSON.stringify(d, null, 2));
}

function updateSellOrdersData(d){
    fs.writeFileSync("../database/orders/openSellOrders.json", JSON.stringify(d, null, 2));
}

function updateUserDataBase(usersDatabase){
    fs.writeFileSync("../database/users/users.json", JSON.stringify(usersDatabase, null, 2));
}

function updateStockDatabase(stockDatabase){
    fs.writeFileSync("../database/stocks/data.json", JSON.stringify(stockDatabase, null, 2))
}