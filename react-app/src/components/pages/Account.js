import React from 'react';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import Header from "../Header";
import "../css/Account.css"





  export default function account(){

    /*
render account info
- purpose: display user account info and stock holding
- in: user object
- out: N/A
*/
const handleAccountBalance = () =>{
    const user = {
        username: "jerry137",
        password : "123456",

        name: "Jerry Smith",
        UID: "c117",
        watchlist: ["AAL", "TSLA", "FB", "SHOP"],
        eventList: ["AAL", "SE"],
        ownedStocks: [
            {
                name: "American Airlines Group Inc.",
                quote: "12.74",
                symbol: "AAL",
                share: 20
        }
    ],
        activity: [
            "Brought 26 shares of TSLA",
            "Sold 26 shares of AAL"
        ],
        account: {
            accountName: "TFSA Account CAD 25MBJ",
            cashBalance: 4048.28,
            investmentBalance: 0
        },
        balanceGrowth: "-20%"

    };


    let accountName = document.getElementById("account-info");
    let totalBalance = document.getElementById("total-balance-text");
    let investmentBalance = document.getElementById("investment-text");
    let cashBalance = document.getElementById("cash-balance-text");
    let username = document.getElementById("username");

    accountName.innerHTML = user.account.accountName;
    cashBalance.innerHTML = "$" + (Math.round( parseFloat(user.account.cashBalance) * 100) / 100).toFixed(2);
    investmentBalance.innerHTML = "$" + (Math.round( parseFloat(user.account.investmentBalance) * 100) / 100).toFixed(2);
    totalBalance.innerHTML = "$" + (Math.round( (parseFloat(user.account.cashBalance) + parseFloat(user.account.investmentBalance)) * 100) / 100).toFixed(2) ;
    username.innerHTML = user.name;


    let holdingBtn = document.getElementById("holdingBtn");

    holdingBtn.addEventListener("click", function(){
        if (activityBtn.classList.contains("selected")){
            activityBtn.classList.remove("selected");
            activityBtn.style.background = "aliceblue";
        }
        this.classList.add("selected");
        this.style.background = "cornflowerblue";
        //render the list of stock holding

        let holdings = document.getElementById("table-container");
        holdings.innerHTML = '';

        for (let index = 0; index < user.ownedStocks.length; index++) {
            const element = user.ownedStocks[index];

            let stock = document.createElement("li");
            stock.id = element.name;
            stock.className = "stock-holding";
            stock.innerHTML = element.name;
            holdings.appendChild(stock);

        }
    });
    let activityBtn = document.getElementById("activityBtn");
    activityBtn.addEventListener("click", function(){

        if (holdingBtn.classList.contains("selected")){
            holdingBtn.classList.remove("selected");
            holdingBtn.style.background = "aliceblue";
        }
        this.classList.add("selected");
        this.style.background = "cornflowerblue";


        for (let index = 0; index < user.activity.length; index++){
            const element = user.activity[index];
            console.log(element);
        }

    });
}


    return(
    <div >
            <Header currentPage={`Account`}/>
            <Container maxWidth="sm">
            <div id="username">Username</div>
            <br/>
            <div id="account-info"></div>
            <br />


            <details>
            <summary>Account Balance</summary>
            <div id="balance-container">
                <div id="total-balance">
                    <span class="title-small">Total Balance: </span>
                    <span class="text-box" id="total-balance-text"></span>
                </div>
                <div id="investments-cash-container">
                    <div id="investment">
                        <span class="title-small">Investment: </span>
                        <span class="text-box" id="investment-text"></span>
                    </div>

                    <div id="cash-balance">
                        <span class="title-small">Cash Balance: </span>
                        <span class="text-box" id="cash-balance-text"></span>
                    </div>
                </div>
            </div>
            </details>




            <div id="account-activity-container">
                <br/>

                <ButtonGroup disableElevation variant="outlined" color="primary" id="option-group">
                    <Button id="holdingBtn">Holdings</Button>
                    <Button id="activityBtn">Activity</Button>
                </ButtonGroup>
                <ul id="table-container"></ul>

            </div>
            </Container>

        </div>
    )
  };
