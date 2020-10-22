"use strict";

function getAccountInfo() {
  var request = new XMLHttpRequest();
  var url = "/getAccount";

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var _user = JSON.parse(request.responseText);
    }
  };

  request.open("GET", url);
  request.send();
}

var watchlist = user.watchlist;
console.log(watchlist);