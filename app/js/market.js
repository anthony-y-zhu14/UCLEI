function getAccountInfo(){
    let request = new XMLHttpRequest();
    let url = "/getAccount";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){               
            let user = JSON.parse(request.responseText);
        }
    };
    request.open("GET", url);
    request.send();
}

let watchlist = user.watchlist;
console.log(watchlist);

