function getAccountInfo(){
    let request = new XMLHttpRequest();
    let url = "/account-info";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){            
            let user = JSON.parse(request.responseText);
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
    const form = {
        name: document.getElementById("account-container"),
        totalBalance: document.getElementById("total-balance"),
        investmentBalance: document.getElementById("investment"),
        cashBalance: document.getElementById("cash-balance")       
    };

    form.name.innerHTML = user.account.accountName;
    form.cashBalance.innerHTML = user.account.cashBalance;
    form.investmentBalance.innerHTML = user.account.investmentBalance;
    form.totalBalance.innerHTML = (user.account.cashBalance + user.account.investmentBalance);

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