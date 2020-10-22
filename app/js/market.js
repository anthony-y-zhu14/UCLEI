// function getAccount() {
//     let request = new XMLHttpRequest();
//     let url = "/getAccount";
//
//     request.onreadystatechange = function(){
//         if (this.readyState == 4 && this.status == 200){
//             let user = JSON.parse(request.responseText);
//             displayWatchList(user);
//         }
//     };
//     request.open("GET", url);
//     request.send();
// }

function displayWatchList(w) {
  let watchlist = w;
  let main = document.getElementById("watchlist");
  main.innerHTML = "";

    for(let i = 0; i < watchlist.length; i++) {
      let lisItem = document.createElement("li");
      lisItem.className = "watch-item";
      let lisDiv = document.createElement("div");
      lisDiv.className = "watch-text";
      let text1 = document.createElement("span");
      let text2 = document.createElement("span");
      let text3 = document.createElement("span");

      text1.innerHTML = watchlist[i].symbol;
      text2.innerHTML = watchlist[i].quote;
      text3.innerHTML = watchlist[i].percentage;

      lisDiv.appendChild(text1);
      lisDiv.appendChild(text2);
      lisDiv.appendChild(text3);
      lisItem.appendChild(lisDiv);
      main.appendChild(lisItem);
      }
}

function getStockInfo() {
  let request = new XMLHttpRequest();
  let url = "/stock-data";
  console.log("");

  request.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
          let w = JSON.parse(request.responseText);
          displayWatchList(w);
      }
  };
  request.open("GET", url);
  request.send();
}

getStockInfo();
// getAccount();
