function getAccountInfo(){
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){    
            console.log("called!");        
            let user = JSON.parse(request.responseText);
            console.log(user);
            renderAccountInfo(user);
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

function renderAccountInfo(user){
  

    let name = document.getElementById("account-container");
    let totalBalance = document.getElementById("total-balance");
    let investmentBalance = document.getElementById("investment");
    let cashBalance = document.getElementById("cash-balance");

    name.innerHTML = user.account.accountName;
    cashBalance.innerHTML = user.account.cashBalance;
    investmentBalance.innerHTML = user.account.investmentBalance;
    totalBalance.innerHTML = (user.account.cashBalance + user.account.investmentBalance);

    //render the donut chart
    
    //code goes here



    //render the chart legend

    //code goes here

    document.getElementById("holdingBtn").addEventListener("click", function(){
        //render the list of stock holding
        // let parent = document.getElementById("table-container");
        user.ownedStock.forEach(element => {
            console.log(element.name);            
        });
    });
    document.getElementById("activityBtn").addEventListener("click", function(){
        //render the list of activity

        user.activity.forEach(element => {
            console.log(element.name);            
        });
    });

}

getAccountInfo();
