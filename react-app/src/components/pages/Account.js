import React from 'react';
import "../css/Account.css"
import Header from "../Header";

class Account extends React.Component {
       

    render() {
      return (
          <div>
                <Header/>
                <div id="account-asset-container">
                <div id="account-container">
                    <span></span>
                </div>

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

                <div id="asset-allocation-container">
                    <span id="donut-chart"></span>
                    <span id="donut-chart-legend"></span>
                </div>

                </div>

                <div id="account-activity-container">
                    <div id="username">Double Down Debbie</div>

                    <div id="option-container">
                        <span id="holdingBtn">Holdings</span>
                        <span id="activityBtn">Activity</span>
                    </div>

                    <ul id="table-container">
                    
                    </ul>


                </div>
          </div>
        

      );
    }
  };

  export default Account;