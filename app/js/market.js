function displayWatchList(w) {
  let watchlist = w;
  let main = document.getElementById("watchlist");
  main.innerHTML = "";

    for(let i = 0; i < watchlist.length; i++) {
      let lisItem = document.createElement("li");
      lisItem.id = watchlist[i].symbol;
      lisItem.className = "watch-item";
      let lisDiv = document.createElement("div");
      lisDiv.className = "watch-text";
      let text1 = document.createElement("div");
      let text2 = document.createElement("div");
      let text3 = document.createElement("div");

      let rmvBtn = document.createElement("div");
      rmvBtn.className = "removeBtn";
      let x = document.createElement("i");
      x.className = "fa fa-close";
      rmvBtn.appendChild(x);

      let viewBtn = document.createElement("div");
      viewBtn.className = "view";
      let v = document.createElement("i");
      v.className = "fa fa-eye";
      viewBtn.appendChild(v);

      let eventBtn = document.createElement("div");
      eventBtn.className = "event";
      let e = document.createElement("i");
      e.className = "fa fa-bell";
      eventBtn.appendChild(e);


      text1.innerHTML = watchlist[i].symbol;
      text2.innerHTML = watchlist[i].quote;
      text3.innerHTML = watchlist[i].percentage;

      lisDiv.appendChild(text1);
      lisDiv.appendChild(text2);
      lisDiv.appendChild(text3);
      lisItem.appendChild(lisDiv);
      lisItem.appendChild(x);
      lisItem.appendChild(e);
      lisItem.appendChild(v);

      main.appendChild(lisItem);
    }

      document.querySelectorAll(".fa-close").forEach((item, i) => {

        item.addEventListener("click", function() {
          let data = item.parentNode.id;
          let request = new XMLHttpRequest();
          let url = "/removeWatchItem";

          request.open("post", url);
          request.setRequestHeader("Content-Type", "text/plain");
          request.send(JSON.stringify(data));
          console.log(data);
          getStockInfo();
        });
      });


      document.querySelectorAll(".fa-bell").forEach((item, i) => {

        item.addEventListener("click", function() {
          let data = item.parentNode.id;
          let request = new XMLHttpRequest();
          let url = "/addEventNotify";

          request.open("post", url);
          request.setRequestHeader("Content-Type", "text/plain");
          request.send(JSON.stringify(data));
          console.log(data);
          getStockInfo();

        });
      });

      document.querySelectorAll(".fa-bookmark").forEach((item, i) => {
        item.addEventListener("click", function() {
          let data = item.parentNode.parentNode.childNodes[3].textContent;
          let request = new XMLHttpRequest();
          let url = "/addWatchItem";

          request.open("post", url);
          request.setRequestHeader("Content-Type", "text/plain");
          request.send(JSON.stringify(data));
          console.log(JSON.stringify(data));

          getStockInfo();

        });
      });
}

function getStockInfo() {
  let request = new XMLHttpRequest();
  let url = "/stock-data-w";
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
