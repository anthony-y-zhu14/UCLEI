function getAccountInfo(){
    let request = new XMLHttpRequest();
    let url = "";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            
            let accountInfo = JSON.parse(request.responseText);
            renderAccountInfo(accountInfo);
        }
    };

    request.open("GET", url);
    request.send();
}

function renderAccountInfo(accountInfo){
    const form = {
        name: document.getElementById("account-container"),
        totalBalance: document.getElementById("total-balance"),
        investmentBalance: document.getElementById("investment"),
        cashBalance: document.getElementById("cash-balance")       
    };

    form.name.innerHTML = accountInfo.name;
    form.cashBalance.innerHTML = accountInfo.cash;
    form.investmentBalance.innerHTML = accountInfo.investment;
    form.totalBalance.innerHTML = accountInfo.totalBalance;

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