"use strict";

function getAccountInfo() {
  var request = new XMLHttpRequest();
  var url = "/getAccount";

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var user = JSON.parse(request.responseText);
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
  var name = document.getElementById("account-container");
  var totalBalance = document.getElementById("total-balance-text");
  var investmentBalance = document.getElementById("investment-text");
  var cashBalance = document.getElementById("cash-balance-text");
  name.innerHTML = user.account.accountName;
  cashBalance.innerHTML = user.account.cashBalance;
  investmentBalance.innerHTML = user.account.investmentBalance;
  totalBalance.innerHTML = user.account.cashBalance + user.account.investmentBalance; //render the donut chart
  //code goes here
  // render the chart legend
  // code goes here

  document.getElementById("holdingBtn").addEventListener("click", function () {
    //render the list of stock holding
    // let parent = document.getElementById("table-container");
    for (var index = 0; index < user.ownedStocks.length; index++) {
      var element = user.ownedStocks[index];
      console.log(element);
    }
  });
  document.getElementById("activityBtn").addEventListener("click", function () {
    //render the list of activity
    user.activity.forEach(function (element) {
      console.log(element.name);
    });
  });
}

getAccountInfo();