import React, { useState } from 'react';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import Header from "../Header";
import ContainedButtons from "../Button.js"
import "../css/Account.css"

class Account extends React.Component {
    constructor() {
        super();
        this.state = {
            user: undefined,
            holdingBtn: false,
            activityBtn: false
          };
        
    }
    
    componentDidMount() {
      this.callBackendAPI()
        .then(res => this.setState({ user: res }))
        .catch(err => console.log(err));
    }

    callBackendAPI = async () => {
        const response = await fetch('/getAccount');
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
    };

    handleHolding() {
        console.log('foo');
        this.setState.holdingBtn(true);
        this.setState.activityBtn(false);
    }

    handleActivity() {
        console.log('bar');
        this.setState.activityBtn(true);
        this.setState.holdingBtn(false);
    }

    render() {

        let btnClass = this.state.holdingBtn ?  'selected' : 'unselected';

        if(!this.state.user) {
            return (
              <h1>Loading...</h1>
            );
          }
          
        return(
            <div>
                    <Header currentPage={`Account`}/>
                    <Container maxWidth="sm">
                    <div id="username">{this.state.user.name}</div>
                    <br/>
                    <div id="account-info">{this.state.user.account.accountName}</div>
                    <br />
    
    
                    <details>
                    <summary>Account Balance</summary>
                    <div id="balance-container">
                        <div id="total-balance">
                            <span class="title-small">Total Balance: </span>
                            <span class="text-box" id="total-balance-text">
                                {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}
                            </span>
                        </div>
                        <div id="investments-cash-container">
                            <div id="investment">
                                <span class="title-small">Investment: </span>
                                <span class="text-box" id="investment-text">
                                    {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}
                                </span>
                            </div>
    
                            <div id="cash-balance">
                                <span class="title-small">Cash Balance: </span>
                                <span class="text-box" id="cash-balance-text">
                                    {"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    </details>
    
    
    
    
                    <div id="account-activity-container">
                        <br/>
                        <ButtonGroup disableElevation variant="outlined"  id="option-group">
                            <ContainedButtons className={btnClass} id="holdingBtn" text={'Holding'} toggle={this.state.holdingBtn} onClick={this.handleHolding}/>
                            <ContainedButtons className={btnClass} id="activityBtn" text={'Activity'} toggle={this.state.activityBtn} onClick={this.handleActivity}/>
                        </ButtonGroup>
                        <ul id="table-container"></ul>
    
                    </div>
                    </Container>
    
                </div>
            )
    }
}

  export default Account;



      

    // /*
    // render account info
    // - purpose: display user account info and stock holding
    // - in: user object
    // - out: N/A
    // */
    // const handleAccountBalance = () =>{        


    //     let accountName = document.getElementById("account-info");
    //     let totalBalance = document.getElementById("total-balance-text");
    //     let investmentBalance = document.getElementById("investment-text");
    //     let cashBalance = document.getElementById("cash-balance-text");
    //     let username = document.getElementById("username");

    //     accountName.innerHTML = user.account.accountName;
    //     cashBalance.innerHTML = "$" + (Math.round( parseFloat(user.account.cashBalance) * 100) / 100).toFixed(2);
    //     investmentBalance.innerHTML = "$" + (Math.round( parseFloat(user.account.investmentBalance) * 100) / 100).toFixed(2);
    //     totalBalance.innerHTML = "$" + (Math.round( (parseFloat(user.account.cashBalance) + parseFloat(user.account.investmentBalance)) * 100) / 100).toFixed(2) ;
    //     username.innerHTML = user.name;


    //     let holdingBtn = document.getElementById("holdingBtn");

    //     holdingBtn.addEventListener("click", function(){
    //         if (activityBtn.classList.contains("selected")){
    //             activityBtn.classList.remove("selected");
    //             activityBtn.style.background = "aliceblue";
    //         }
    //         this.classList.add("selected");
    //         this.style.background = "cornflowerblue";
    //         //render the list of stock holding

    //         let holdings = document.getElementById("table-container");
    //         holdings.innerHTML = '';

    //         for (let index = 0; index < user.ownedStocks.length; index++) {
    //             const element = user.ownedStocks[index];

    //             let stock = document.createElement("li");
    //             stock.id = element.name;
    //             stock.className = "stock-holding";
    //             stock.innerHTML = element.name;
    //             holdings.appendChild(stock);

    //         }
    //     });
    //     let activityBtn = document.getElementById("activityBtn");
    //     activityBtn.addEventListener("click", function(){

    //         if (holdingBtn.classList.contains("selected")){
    //             holdingBtn.classList.remove("selected");
    //             holdingBtn.style.background = "aliceblue";
    //         }
    //         this.classList.add("selected");
    //         this.style.background = "cornflowerblue";


    //             for (let index = 0; index < user.activity.length; index++){
    //                 const element = user.activity[index];
    //                 console.log(element);
    //             }

    //         });
    //     }
        


    
  
