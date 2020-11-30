import React from 'react';
import Header from "../Header.js";
import  { Breakpoint } from 'react-socks';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import NewsList from '../NewsList.js';
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from '@material-ui/core';
import Fourohone from '../fourohone.js';
import LineChartB from '../lineChartB.js';
import MarketTable from '../marketTable.js';
import AccountData from '../AccountData.js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      session_id: null,
      stockData: undefined,
      market: undefined,
      };
  };

  readStock = async() => {
    const response = await fetch(`/stock-data?search=D35-C`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  }

  fetchMarket = async() => {
    const response = await fetch(`/stock-data`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  }

  componentDidMount() {
  this.setState({session_id: this.props.session_id});

  this.readStock()
    .then(res => this.setState({ stockData : res } ))
    .catch(err => console.log(err));

  this.fetchMarket()
    .then(res => this.setState({ market : res[0] } ))
    .catch(err => console.log(err));

  this.callBackendAPI()
    .then(res => this.setState({ user: res}))
    .catch(err => console.log(err));
  }
  // Fetches our GET route to account info from server.js
  callBackendAPI = async () => {
    const response = await fetch('/getAccount');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

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
    if(!this.state.user || !this.state.stockData || !this.state.market) {
      return (
        <div>
            <h1>Loading</h1>
            <LinearProgress/>
        </div>
      );
    }
    if(!this.state.session_id) {
      return (
        <React.Fragment className={classes.error}>
          <h1>401 Not Authorized.</h1>
          <a href="\login">Go back to Login</a>
        </React.Fragment>
      );
    }
    let crtPg = 'Dashboard';
    let username = this.state.user.username;
    return (
      <React.Fragment>
      <Header currentPage={crtPg} userName={username}/>
        <Container style={{ width: '95vw', padding: 0 }}>
          <Breakpoint medium up>
            <Grid container>
              <Grid item xs={8}>
                <Container style={{marginTop: "2.25%"}}>
                  <LineChartB cData={this.state.stockData}/>
                  <MarketTable stockData={this.state.market}/>
                </Container>
              </Grid>
              <Grid item xs={3}>
              <AccountData acct={this.state.user}/>
                  <NewsList />
              </Grid>
            </Grid>
          </Breakpoint>
          <Breakpoint small down>
          <Grid item xs={12}>
            <AccountData acct={this.state.user}/>
          </Grid>
              <Grid item xs={12}>
                  <NewsList />
              </Grid>
          </Breakpoint>
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
