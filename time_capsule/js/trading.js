function getAccountInfo_trading(){
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){               
            let user = JSON.parse(request.responseText);            
            renderHoldingInfo(user);    
            action(user);        
        }
    };
    request.open("GET", url);
    request.send();
}

function getStockInfo(search_term) {
    let request = new XMLHttpRequest();
    let url = `/stock-data?search=${search_term}`;         
  
    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let s = JSON.parse(request.responseText);
            renderSearchResult(s);         
        }
    };
    request.open("GET", url);    
    request.send(JSON.stringify(search_term));    
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
    let accountName = document.getElementById("account-container");
    accountName.innerHTML = user.account.accountName;
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
render search result
- purpose: display user account info and stock holding
- in: user object
- out: N/A
*/
function renderSearchResult(stock){
    let search_result = document.getElementById("stockFound");
    search_result.innerHTML = stock[0].symbol;
}

/*
place order
- purpose: allows a user to make a market buy or sell
- in: quantity, limit price, stock, user
- out: order ID, int
*/
function action(user){
    document.getElementById("searchBtn").addEventListener("click", function(){
        let search_term = document.getElementById("search-input").value;  
        getStockInfo(search_term);  
        let result = document.getElementById("searchResult");    
        result.click();
    });
     
          
    
    
    let buyBtn = document.getElementById("buyBtn");
    let sellBtn = document.getElementById("sellBtn");
    let completeOrderBtn = document.getElementById("CompleteTransactionBtn");
    buyBtn.addEventListener("click", function(){
        if (sellBtn.classList.contains("selected")){
            sellBtn.classList.remove("selected");  
            sellBtn.style.background = "aliceblue";                   
        }     
        this.classList.add("selected");
        this.style.background = "#2ed47a"; 
    });
    
    sellBtn.addEventListener("click", function(){
        if (buyBtn.classList.contains("selected")){
            buyBtn.classList.remove("selected");  
            buyBtn.style.background = "aliceblue";                   
        } 
        this.classList.add("selected");
        this.style.background = "indianred";         
    });

    completeOrderBtn.addEventListener("click", function(){
        let quantity = parseInt(document.getElementById("trading-quantity-input").value);
        if (buyBtn.classList.contains("selected")){
            buy(quantity);
        }
        else if(sellBtn.classList.contains("selected")){
            sell(quantity);
        }
        else{
            alert("please choose buy or sell");
            return;
        }
    });
    
    

    function buy(q){

        console.log(`Client ${user.username} tried to buy ${q} of stock.`);
        
       
        let stockSymbol = document.getElementById("stockFound").innerHTML;
        let data = {
            name: stockSymbol, 
            n: q
        };
        let request = new XMLHttpRequest();
        let url = "/buyStock";

        request.open("post", url);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(JSON.stringify(data));
        console.log(data);
    }
    
    function sell(q){  
        console.log(`Client ${user.username} tried to sell ${q} of stock.`);
        
       let stockSymbol = document.getElementById("stockFound").innerHTML;
       let data = {
           name: stockSymbol, 
           n: q
       };
       let request = new XMLHttpRequest();
       let url = "/sellStock";

       request.open("post", url);
       request.setRequestHeader("Content-Type", "text/plain");
       request.send(JSON.stringify(data));
       console.log(data);
    
       
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







