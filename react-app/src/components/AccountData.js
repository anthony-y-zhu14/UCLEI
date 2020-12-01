import React from "react";
import { Button, ButtonGroup, Container } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  acctCard: {
    background: '#393b41',
    textAlign: "center",
    color: '#fff',
    padding: '1%',
    marginTop: '6%',
    borderRadius: 10,
  },
  button: {
    color: '#6C9FF8',
    background: "#393b41",
  },
};

class AccountData extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          user: this.props.acct
      };
  }

  calculateGrowth = () =>{
    return ((this.state.user.account.cashBalance + this.state.user.account.investmentBalance - this.state.user.account.totalDeposit)/this.state.user.account.totalDeposit).toFixed(2)
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Container className={classes.acctCard}>
          <h2>{this.state.user.name}</h2>
          <h3>Account: {this.state.user.account.accountName}</h3>
          <p>Account Balance: {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</p>
          <p>Account Investment Balance: {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}</p>
          <span>Account Growth:  </span>
          <span style={ this.calculateGrowth() >= 0 ?{color: "#2ed47a"}:{color: "indianred"} }>{this.calculateGrowth()}%</span>

        </Container>
      </React.Fragment>

    );
  }
}

// <Button href='/account' className={classes.button}>
//   View More
// </Button>

export default withStyles(styles)(AccountData);
