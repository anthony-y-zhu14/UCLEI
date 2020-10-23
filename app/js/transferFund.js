function getUserInfo(){
    let request = new XMLHttpRequest();
    let url = "/getBalance";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){

            let currentCashBalance = JSON.parse(request.responseText);
            renderAccountInfo(parseFloat(currentCashBalance));
        }
    };
    request.open("GET", url);
    request.send();

}

function renderAccountInfo(currentCashBalance){
  document.querySelectorAll("#money").forEach((item, i) => {
    item.innerHTML = (Math.round( parseFloat(currentCashBalance) * 100) / 100).toFixed(2);
  });

    // let cashBalance = document.getElementById("money");
    // cashBalance.innerHTML = currentCashBalance;
}

/* deposit
- purpose: handles a user depositing money to their account
- in: amount, user
- out: boolean
*/
function deposit() {
  console.log("foo");

    //get user balance
    let cashBalance = parseFloat(document.getElementById("money").innerHTML);

    //get user input for added funds amount
    let userInput = parseFloat(document.getElementById("money-form").value);
    let data = cashBalance + userInput;

    //post request to server and update the user balance
    let request = new XMLHttpRequest();
    let url = "/updateBalance";

    request.open("post", url);
    request.setRequestHeader("Content-Type", "text/plain");
    request.send(JSON.stringify(data));

    getUserInfo();
}

/*
withdraw
- purpose: allows user to withdraw cash from their account
- in: amount, user
- out: boolean (false if not enough funds)
*/
function withdraw() {

    //get user balance
    let cashBalance = parseFloat(document.getElementById("money").innerHTML);
    console.log(cashBalance);
    console.log(typeof(cashBalance));
    let data;

    //get user input for added funds amount
    let userInput = parseFloat(document.getElementById("money-form").value);
    console.log(userInput)
    if(userInput < cashBalance) {
        data = cashBalance - userInput;
        let request = new XMLHttpRequest();
        let url = "/updateBalance";

    request.open("post", url);
    request.setRequestHeader("Content-Type", "text/plain");
    request.send(JSON.stringify(data));
    console.log(data);
    }

    else{
        alert("Not enough fund to support that transaction.")
    }

    getUserInfo();
}



document.getElementById("money-deposit").addEventListener("click", deposit);
document.getElementById("money-withdraw").addEventListener("click", withdraw);
getUserInfo();
