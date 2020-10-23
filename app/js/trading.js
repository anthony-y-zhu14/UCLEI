function getAccountInfo_trading(){
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){               
            let user = JSON.parse(request.responseText);
            renderHoldingInfo(user);            
        }
    };
    request.open("GET", url);
    request.send();
}

/*
render account info
- purpose: display user account info and stock holding
- in: user object
- out: N/A
*/

function renderHoldingInfo(user){
    let holdings = document.getElementById("stock-list");
    holdings.innerHTML = '';
    let cashBalance = document.getElementById("cash");
    cashBalance.innerHTML = "Cash Balance: $" + (Math.round( parseFloat(user.account.cashBalance) * 100) / 100).toFixed(2);
    

    for (let index = 0; index < user.ownedStocks.length; index++) {
        const element = user.ownedStocks[index];
        let stock = document.createElement("li");
        stock.id = element.name;     
        stock.className = "stock-holding";
        stock.innerHTML = element.name;
        holdings.appendChild(stock);                          
    }
}

/*
place order
- purpose: allows a user to make a market buy or sell
- in: quantity, limit price, stock, user
- out: order ID, int
*/
function placeOrder(stock){
    let quantity = document.getElementById("trading-quantity-input").value;
    document.getElementById("searchBtn").addEventListener("click", searchStock);

    function searchStock(){
        let search_term = document.getElementById("search-input").value;
        let result_list = document.getElementById("stock-result-list");
        
    }

    function buy(quantity, limitPrice, stock, user){
    

        /*
        if quantity * stock.price is more than user.account.cashBalance:
            -   alert ("you don't have enough money!")
            -   return
        */
    
        
        /*
        if stock not in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
            -   remove quantity * stock.price amount of cash from user.cashBalance
            -   add stock to users stock holding
            -   update stock shares in user       
        */
    
        /*
        else if stock in user.ownedstock and quantity * stock.price is less than user.account.cashBalance:
            -   remove quantity * stock.price amount of cash from user.cashBalance       
            -   update stock shares in user       
        */
    
        //generate an orderID and add that to user activity and return that
    
    }
    
    function sell(quantity, limitPrice, stock, user){  
        
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
    
        /*
        if stock in user.ownedstock and quantity is more to user.stock.shares:
            -   alert ("You don't own enough of that stock")
            -   return         
        */
    
        //generate an orderID and add that to user activity and return that
    }
}



/*
cancel order
- purpose: cancels an order before the market buy
- in: order ID
- out: boolean
*/
function cancelOrder(orderID){

}

getAccountInfo_trading();