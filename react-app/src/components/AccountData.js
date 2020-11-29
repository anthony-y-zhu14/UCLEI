import React from "react";
import { Button, ButtonGroup, Container } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  acctCard: {
    background: '#393b41',
    color: '#fff',
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

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Container className={classes.acctCard}>
          <h3>Account: {this.state.user.account.accountName}</h3>
          <p>Account Balance: {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</p>
          <p>Account Investment Balance: {"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}</p>
          <p>Account Growth: {this.state.user.balanceGrowth}%</p>
          <Button href='/account' className={classes.button}>
            View More
          </Button>
        </Container>
      </React.Fragment>

    );
  }
}

export default withStyles(styles)(AccountData);
