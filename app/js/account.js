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
    });
    document.getElementById("activityBtn").addEventListener("click", function(){
        //render the list of activity
    });

}