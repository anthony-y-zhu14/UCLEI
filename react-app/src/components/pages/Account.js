import React from 'react';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import Header from "../Header";

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

    handleHolding = (e) =>{
        this.setState({
            holdingBtn: true
        })
        this.setState({
            activityBtn: false
        })
    }

    handleActivity = (e) =>{
        this.setState({
            holdingBtn: false
        })
        this.setState({
            activityBtn: true
        })
    }


    render() {



        if(!this.state.user) {
            return (
              <h1>Loading...</h1>
            );
        }

        return(
            <div>
                    <Header currentPage={`Account`} userName={this.state.user.name}/>

                    <Container maxWidth="sm">
                      <div id="username">{this.state.user.name}</div>
                      <br/>
                      <div id="account-info">{this.state.user.account.accountName}</div>
                      <br />
                    </Container>
                    <div className='wrapper'>
                      <div className='innerCont'>
                          <details>
                          <summary>Account Balance</summary>
                          <div id="balance-container">
                              <div id="total-balance">
                                  <span className="title-small">Total Balance: </span>
                                  <span className="text-box" id="total-balance-text">
                                      {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}
                                  </span>
                              </div>
                              <div id="investments-cash-container">
                                  <div id="investment">
                                      <span className="title-small">Investment: </span>
                                      <span className="text-box" id="investment-text">
                                          {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}
                                      </span>
                                  </div>

                                  <div id="cash-balance">
                                      <span className="title-small">Cash Balance: </span>
                                      <span className="text-box" id="cash-balance-text">
                                          {"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          <div id="account-activity-container">
                              <br/>
                              <ButtonGroup disableElevation variant="outlined"  id="option-group">
                                  <Button id="holdingBtn" style={this.state.holdingBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleHolding}>Holding</Button>
                                  <Button id= "activityBtn" style={this.state.activityBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleActivity}>Activity</Button>
                              </ButtonGroup>
                              <ul id="table-container">

                              <div>
                                  {this.state.holdingBtn && (
                                      <React.Fragment>
                                          {this.state.user.ownedStocks.map(stock => (
                                              <li id={stock.name} className="stock-holding">{stock.name}</li>
                                          ))}
                                      </React.Fragment>
                                  )}
                                  {this.state.activityBtn && (
                                      <React.Fragment>
                                          {this.state.user.activity.map(activity => (
                                              <li id={activity} className="stock-holding">{activity}</li>
                                          ))}
                                      </React.Fragment>
                                  )}
                              </div>
                              </ul>

                          </div>
                          </details>
                        </div>
                      <div className='innerCont'>
                        <details>
                        <summary>Manage Account</summary>
                        <div id="balance-container">
                            <div id="total-balance">
                                <span className="title-small">Total Balance: </span>
                                <span className="text-box" id="total-balance-text">
                                    {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}
                                </span>
                            </div>
                            <div id="investments-cash-container">
                                <div id="investment">
                                    <span className="title-small">Investment: </span>
                                    <span className="text-box" id="investment-text">
                                        {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}
                                    </span>
                                </div>

                                <div id="cash-balance">
                                    <span className="title-small">Cash Balance: </span>
                                    <span className="text-box" id="cash-balance-text">
                                        {"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        </details>
                      </div>
                </div>

                </div>
            )
    }
}

  export default Account;
