function getAccount() {
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let user = JSON.parse(request.responseText);
            displayWatchList(user);
        }
    };
    request.open("GET", url);
    request.send();
}

function displayWatchList(u) {
  let user = u;
  let watchlist = user.watchlist;



  let main = document.getElementById("watchlist");

      for(let i = 0; i < watchlist.length; i++) {
        let lisItem = document.createElement("li");
        lisItem.className = "watch-item";
        let lisDiv = document.createElement("div");
        lisDiv.className = "watch-text";
        let text1 = document.createElement("SPAN");
        let text2 = document.createElement("SPAN");
        let text3 = document.createElement("SPAN");
      }
}

function getStockInfo() {
  let request = new XMLHttpRequest();
  let url = "/stock-data";
  console.log("");

  request.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
          let user = JSON.parse(request.responseText);
      }
  };
  request.open("GET", url);
  request.send();
}
getStockInfo();

getAccount();
