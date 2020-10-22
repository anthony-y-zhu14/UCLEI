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

function renderHoldingInfo(user){
    let holdings = document.getElementById("stock-list");
    holdings.innerHTML = '';

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
- purpose: allows a user to make a market buy
- in: quantity, limit price, stock, user
- out: order ID, int
*/
function placeOrder(){

}


/*
cancel order
- purpose: cancels an order before the market buy
- in: order ID
- out: boolean
*/


getAccountInfo_trading();