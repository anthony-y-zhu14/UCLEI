import React from 'react';
import { Button, ButtonGroup, Container, LinearProgress } from '@material-ui/core';
import Header from "../Header";
import  { Breakpoint } from 'react-socks';
import { withStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import Fourohone from '../fourohone.js';
import OutlinedCard from '../OutlinedCard.js';
import Grid from '@material-ui/core/Grid';
import AccountData from '../AccountData.js';
import AccountTable from '../acctTable.js';


import "../css/Account.css"

const styles = {
  input: {
    color: "#fff"
  },
  acctCard: {
    background: '#393b41',
    textAlign: "center",
    color: '#fff',
    width: '50%',
    padding: '1%',
    marginTop: '6%',
    borderRadius: 10,
  },
  wrapper: {
    background: '#393b41',
    overflowY: 'auto',
    height: '80%',
    color: '#fff',
    borderRadius: '10px',
    margin: "1%",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  fourohone: {
    marginLeft: '10%',
    color: '#000'
  },
  li: {
    marginLeft: '10%',
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
            session_id: undefined,
            growth: undefined
          };
    }

    componentDidMount() {
      this.setState({session_id: this.props.session_id});

      this.callBackendAPI()
        .then(res => this.setState({ 
          user: res
         }))
        .catch(err => console.log(err))        
        
    }

    callBackendAPI = async () => {
        const response = await fetch('/getAccount');
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
    };

    calculateGrowth = () =>{
      return ((this.state.user.account.cashBalance + this.state.user.account.investmentBalance - this.state.user.account.totalDeposit)/this.state.user.account.totalDeposit).toFixed(2)
    }

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

      if (this.state.amount <= 0){
        alert("Please enter a valid amount");
        return;
      }
      if (!this.state.type){
        alert("Please choose an option");
        return;
      }

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({amount: this.state.amount, type: this.state.type})
      }
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
              <React.Fragment>
                <h1>Loading</h1>
                <LinearProgress/>
              </React.Fragment>
            );
        }

        return(
          <React.Fragment>
            <Header currentPage={`Account`} userName={this.state.user.name}/>
            <Container style={{ width: '95vw', padding: 0 }}>
            <Container className={classes.acctCard}>
              <h2>{this.state.user.name}</h2>
              <h3>Account: {this.state.user.account.accountName}</h3>
              <p>Account Total Balance: {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</p>
              <p>Account Investment Balance: {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}</p>
              <span>Account Growth:  </span>
              <span style={ this.calculateGrowth() >= 0 ?{color: "#2ed47a"}:{color: "indianred"} }>{this.calculateGrowth()}%</span>
            </Container>
            <Breakpoint medium up>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <details>
                    <summary>Holdings & Activities</summary>
                    <div className={classes.wrapper}>
                      <br />
                      <h3>Hello, {this.state.user.name}</h3>
                      <p>Below please find your activity and holdings by pressing the desired button.</p>
                        <ButtonGroup disableElevation variant="outlined"  id="option-group">
                            <Button id="money-deposit" style={this.state.holdingBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleHolding}>Holding</Button>
                            <Button id="money-withdraw" style={this.state.activityBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleActivity}>Activity</Button>
                        </ButtonGroup>
                        <ul id="table-container">
                          {this.state.holdingBtn && (
                              <React.Fragment>
                                  {this.state.user.ownedStocks.map(stock => (
                                      <OutlinedCard h={this.props.history} stock={stock}/>))}
                              </React.Fragment>)}
                          {this.state.activityBtn && (
                              <React.Fragment>
                                <AccountTable userData={this.state.user}/>
                              </React.Fragment>)}
                          </ul>
                    </div>
                  </details>
                </Grid>
                <Grid item xs={6}>
                  <details>
                    <summary>Manage Account</summary>
                    <div className={classes.wrapper} style={{paddingBottom: "2%"}}>
                      <br />
                      <h3>Add or Remove Funds</h3>
                      <p>Type the amount of cash you would
                      like to add or remove in the box to
                      the left and select to deposit or withdrawl
                      funds from your account.</p>
                      <ButtonGroup disableElevation variant="outlined"  id="option-group">
                          <Button id="money-deposit" style={this.state.moneyDeposit ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleDeposit}>Deposit</Button>
                          <Button id="money-withdraw" style={this.state.moneyWithdraw ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleWithdrawl}>Withdrawl</Button>
                      </ButtonGroup>
                      <br />
                      <TextField className="txtFld" label="Enter Dollar Amount" type='number'
                      onChange={this.setAmnt} InputProps={{className: classes.input}} value={this.state.amount}
                      variant="outlined" />
                      <Button id="submit" className='submit' onClick={this.handleSubmit}>Submit</Button>
                    </div>
                  </details>
                </Grid>
              </Grid>
              </Breakpoint>
              <Breakpoint small down>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <details>
                      <summary>Holdings & Activities</summary>
                      <div className={classes.wrapper}>
                        <br />
                        <h3>Hello, {this.state.user.name}</h3>
                        <p>Below please find your activity and holdings by pressing the desired button.</p>
                          <ButtonGroup disableElevation variant="outlined"  id="option-group">
                              <Button id="money-deposit" style={this.state.holdingBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleHolding}>Holding</Button>
                              <Button id="money-withdraw" style={this.state.activityBtn ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleActivity}>Activity</Button>
                          </ButtonGroup>
                          <ul id="table-container">
                            {this.state.holdingBtn && (
                                <React.Fragment>
                                    {this.state.user.ownedStocks.map(stock => (
                                        <OutlinedCard h={this.props.history} stock={stock}/>))}
                                </React.Fragment>)}
                            {this.state.activityBtn && (
                                <React.Fragment>
                                  <AccountTable userData={this.state.user}/>
                                </React.Fragment>)}
                            </ul>
                      </div>
                    </details>
                  </Grid>
                  <Grid item xs={12}>
                    <details>
                      <summary>Manage Account</summary>
                      <div className={classes.wrapper} style={{paddingBottom: "2%"}}>
                        <br />
                        <h3>Add or Remove Funds</h3>
                        <p>Type the amount of cash you would
                        like to add or remove in the box to
                        the left and select to deposit or withdrawl
                        funds from your account.</p>
                        <ButtonGroup disableElevation variant="outlined"  id="option-group">
                            <Button id="money-deposit" style={this.state.moneyDeposit ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleDeposit}>Deposit</Button>
                            <Button id="money-withdraw" style={this.state.moneyWithdraw ? {background: "cornflowerblue"}:{background: "aliceblue"}} onClick={this.handleWithdrawl}>Withdrawl</Button>
                        </ButtonGroup>
                        <br />
                        <TextField className="txtFld" label="Enter Dollar Amount" type='number'
                        onChange={this.setAmnt} InputProps={{className: classes.input}} value={this.state.amount}
                        variant="outlined" />
                        <Button id="submit" className='submit' onClick={this.handleSubmit}>Submit</Button>
                      </div>
                    </details>
                  </Grid>
                </Grid>
                </Breakpoint>
            </Container>
          </React.Fragment>
        )
    }
}

  export default withStyles(styles) (Account);
