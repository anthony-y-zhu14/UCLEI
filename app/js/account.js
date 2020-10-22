function getAccountInfo(){
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let user = JSON.parse(request.responseText);
            renderInfo(user);
        }
    };
    request.open("GET", url);
    request.send();
}


/*
render account info
- purpose: display user account info and stock holding
- in: user
- out: N/A
*/

function renderInfo(user) {

    let account = document.getElementById("account-container");
    let totalBalance = document.getElementById("total-balance-text");
    let investmentBalance = document.getElementById("investment-text");
    let cashBalance = document.getElementById("cash-balance-text");
    let username = document.getElementById("username");

    account.innerHTML = user.account.accountName;
    cashBalance.innerHTML = user.account.cashBalance;
    investmentBalance.innerHTML = user.account.investmentBalance;
    totalBalance.innerHTML = (user.account.cashBalance + user.account.investmentBalance);
    username.innerHTML = user.name;

    //render the donut chart

    //code goes here



    // render the chart legend

    // code goes here

    document.getElementById("holdingBtn").addEventListener("click", function(){
        //render the list of stock holding
       
        let holdings = document.getElementById("table-container");    
        holdings.innerHTML = '';

        for (let index = 0; index < user.ownedStocks.length; index++) {
            const element = user.ownedStocks[index];

            let stock = document.createElement("li");
            stock.id = element.name;     
            stock.className = "stock-holding";
            stock.innerHTML = element.name;
            holdings.appendChild(stock);                          

        }
    });
    document.getElementById("activityBtn").addEventListener("click", function(){
        //render the list of activity

        for (let index = 0; index < user.activity.length; index++){
            const element = user.activity[index];
            console.log(element);
        }

    });

}

getAccountInfo();
