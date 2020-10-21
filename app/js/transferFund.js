function getUserInfo(){
    let request = new XMLHttpRequest();
    let url = "/getBalance";

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){

            let currentCashBalance = JSON.parse(request.responseText);
            renderAccountInfo(parseInt(currentCashBalance));

        }
    };
    request.open("GET", url);
    request.send();

}

function renderAccountInfo(currentCashBalance){
    let cashBalance = document.getElementById("money");
    cashBalance.innerHTML = currentCashBalance;
}

/* deposit
- purpose: handles a user depositing money to their account
- in: amount, user
- out: boolean
*/
function deposit() {
  console.log("foo");

    //get user balance
    let cashBalance = document.getElementById("money").innerHTML;

    //get user input for added funds amount
    let userInput = document.getElementById("money-form").value;
    let data = parseInt(cashBalance + userInput);
    console.log(data);
    console.log(typeof(data));

    //post request to server and update the user balance
    let request = new XMLHttpRequest();
    let url = "/updateBalance";

    request.open("post", url);
    request.setRequestHeader("Content-Type", "multipart/form-data");
    request.send(JSON.stringify(data));
}

/*
withdraw
- purpose: allows user to withdraw cash from their account
- in: amount, user
- out: boolean (false if not enough funds)
*/
function withdraw() {

    //get user balance
    let cashBalance = document.getElementById("money").innerHTML;
    console.log(cashBalance);
    let data;

    //get user input for added funds amount
    let userInput = document.getElementById("money-form");
    if(userInput.value < cashBalance) {
        data = cashBalance - userInput.value;
        let request = new XMLHttpRequest();
        let url = "/updateBalance";

        request.open("post", url);
    request.setRequestHeader("Content-Type", "multipart/form-data");
    request.send(JSON.stringify(data));
    }

    else{
        alert("Not enough fund to support that transaction.")
    }
}



document.getElementById("money-deposit").addEventListener("click", deposit);
document.getElementById("money-withdraw").addEventListener("click", withdraw);
getUserInfo();
