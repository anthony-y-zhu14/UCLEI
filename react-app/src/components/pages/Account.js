import React from 'react';
import { Button, ButtonGroup, Container, LinearProgress } from '@material-ui/core';
import Header from "../Header";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import Fourohone from '../fourohone.js';
import OutlinedCard from '../OutlinedCard.js';
import { useHistory } from "react-router-dom";


import "../css/Account.css"

const styles = {
  input: {
    color: "#fff"
  },
  fourohone: {
    marginLeft: '20rem',
    color: '#000'
  },
  li: {
    marginLeft: '20rem',
    textDecoration: 'underline',
    color: '#000',
    '&:hover':{
      color: '#6C9FF8',
      cursor: 'pointer'
    },
  }
};

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            holdingBtn: true,
            activityBtn: false,
            moneyDeposit: false,
            moneyWithdraw: false,
            amount: 0,
            type: undefined,
            session_id: undefined
          };
    }

    componentDidMount() {
      this.setState({session_id: this.props.session_id});

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

    handleDeposit = (e) =>{
        this.setState({
          moneyDeposit: true
        })
        this.setState({
          moneyWithdraw: false
        })
        this.setState({
          type: 'deposit'
        })
    }

    handleWithdrawl = (e) =>{
        this.setState({
          moneyDeposit: false
        })
        this.setState({
          moneyWithdraw: true
        })
        this.setState({
          type: 'withdrawl'
        })
    }

    setAmnt = event => {
        this.setState ({
          amount: event.target.value
        });
  }

    handleSubmit = async (value) => {

      let target_url = "/updateBalance";

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({amount: this.state.amount, type: this.state.type})
      }
      console.log(requestOptions);

      await fetch(target_url, requestOptions);

      this.callBackendAPI()
        .then(res => this.setState({ user: res }))
        .catch(err => console.log(err));

    }
    render() {
      const { classes } = this.props;

      if(!this.state.user && !this.state.session_id) {
        return (
          <div>
            <h1 className={classes.fourohone}>401 Not Authorized.</h1>
            <a className={classes.li} href='/login'>Return to Login</a>
            <Fourohone />
          </div>
        );
      }

        if(!this.state.user) {
            return (
              <div>
                  <h1>   Loading   </h1>
                  <LinearProgress/>
              </div>
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
                          <div id="add-funds-modal">
                            <div className="modal-content">
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
                                    <Button id="money-deposit" style={this.state.holdingBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleHolding}>Holding</Button>
                                    <Button id="money-withdraw" style={this.state.activityBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleActivity}>Activity</Button>
                                </ButtonGroup>
                                <ul id="table-container">


                                    {this.state.holdingBtn && (
                                        <React.Fragment>
                                            {this.state.user.ownedStocks.map(stock => (
                                                <OutlinedCard h={this.props.history} stock={stock}/>

                                            ))}
                                        </React.Fragment>
                                    )}
                                    {this.state.activityBtn && (
                                        <React.Fragment>
                                            {this.state.user.activity.map(activity => (
                                              activity.activities.map(message =>(
                                                <li className="stock-holding">{message.message}</li>
                                              ))
                                                
                                            ))}
                                        </React.Fragment>
                                    )}

                                </ul>

                            </div>
                            </div>
                          </div>
                          </details>
                        </div>
                      <div className='innerCont'>
                        <details>
                        <summary>Manage Account</summary>

                        <div id="add-funds-modal" >
                            <div className="modal-content">
                          <br />
                          <br />

                          <div id="info-box">
                            <div className="info-box">
                              <div className="info-title">Add and Remove Funds</div>

                              <div id="info-text">

                                Type the amount of cash you would
                                like to add or remove in the box to
                                the left and select to deposit or withdrawl
                                funds from your account.

                                </div>
                                <br />

                            </div>
                          </div>

                          <form>
                            <div id="modal-account-balance">
                              <span className="modal-text">Account Balance:</span>
                              <span className="modal-text" className="cashBalance" id="money">
                              {"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}
                              </span>
                            </div>


                            <TextField className="txtFld" label="Input Dollar Amount"
                            onChange={this.setAmnt} InputProps={{className: classes.input}} value={this.state.amount}
                            variant="outlined" />
                            <div id="modal-container">

                              <div id="buttons-modal">
                              <br />
                              <ButtonGroup disableElevation variant="outlined"  id="option-group">
                                  <Button id="money-deposit" style={this.state.moneyDeposit ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleDeposit}>Deposit</Button>
                                  <Button id="money-withdraw" style={this.state.moneyWithdraw ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleWithdrawl}>Withdrawl</Button>
                              </ButtonGroup>
                              <br />

                              </div>

                          </div>

                          <Button id="submit" className='submit' onClick={this.handleSubmit}>Submit</Button>

                          </form>
                        </div>
                        </div>


                        </details>
                      </div>
                </div>

                </div>
            )
    }
}

  export default withStyles(styles) (Account);
