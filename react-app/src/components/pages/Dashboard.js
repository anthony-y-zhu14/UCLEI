import React from 'react';
import Header from "../Header.js";
import NewsList from '../NewsList.js';
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from '@material-ui/core';
import Fourohone from '../fourohone.js';
import LineChart from '../Linechart.js';

const styles = {
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'absolute',
    width: '90%',
    height: '100%',
    justifyContent: 'space-around',
    margin: '2%',
    zIndex: 2
  },
  font: {
    marginLeft: '2%'
  },
  accountContainer: {
    display: 'wrap',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '45%',
    height: '25%',
    borderRadius: '10px',
    position: 'relative',
    background: '#393b41',
    color: '#fff',
    margin: '.5%',
    left: '-25%',
    top: '-26%'
  },
  newsContainer: {
    width: '45%',
    height: '92%',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: '10px',
    position: 'relative',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    background: '#393b41',
    color: '#fff',
    margin: '.5%'
  },
  chartContainer: {
    display: 'wrap',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '45%',
    height: '65%',
    borderRadius: '10px',
    position: 'relative',
    background: '#393b41',
    color: '#fff',
    margin: '.5%'
  },
  mrkt: {
    position: 'absolute',
    left: '-20px',
    bottom: '20px',
    zIndex: -2
  },
  acctBln: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    order: 1,
    width: '95%',
    height: '25%',
    borderRadius: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    background: '#35363C',
    margin: '2%'
  },
  acctGrw: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    order: 2,
    width: '95%',
    height: '25%',
    borderRadius: '10px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    background: '#35363C',
    margin: '2%'
  },
  acctTxt: {
    fontSize: '.8rem',
    position: 'relative',
    marginLeft: '2%',
    fontWeight: 'bolder'

  },
  innBln: {
    width: '40%'
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      session_id: null,
      stockData: {
        "name": "Dimension 35-C",
        "symbol": "D35-C",
        "market": "Dimension 35-C - Real Time Price. Currency in USD",
        "percentage": "-0.82 (-6.21%)",
        "volume": 2030,
        "quote": 1200000.38,
        "prev_close": "1190000.40",
        "open": "1199990.23",
        "daily_range": "1189000.40 - 1304600.32",
        "historical": [1189000.40, 1304600.32]
    }
      };
  };

  //this.props.location.state.session_id

  componentDidMount() {

    // this.setState({session_id: this.props.location.state.session_id})
    // Calls our fetch below once the component mounts

  this.setState({session_id: this.props.session_id});

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

    if(!this.state.user) {
      return (

        <div>
            <h1>   Loading   </h1>
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
        <div>

          <Header currentPage={crtPg} userName={username}/>
          <div className={classes.main}>
            <div className={classes.chartContainer}>
            <h3 className={classes.font}>NASDAQ</h3>
            <LineChart className={classes.chart} cData={this.state.stockData}/>              
            </div>
            <div className={classes.newsContainer}>
            <h3 className='mrkt'>Market News</h3>
            <NewsList />

            </div>
            <div className={classes.accountContainer}>
            <h3 className={classes.font}>Account Details</h3>
              <div className={classes.acctBln}>
                <div className={classes.innBln}>
                  <span>Account Balance: </span>
                  <span className={classes.acctTxt}>${this.state.user.account.cashBalance}</span>
                </div>
                <div className={classes.innBln}>
                  <span>Investment Balance: </span>
                  <span className={classes.acctTxt}>${this.state.user.account.investmentBalance}</span>
                </div>
              </div>

              <div className={classes.acctGrw}>
                <div className={classes.innBln}>
                  <span>Account Growth: </span>
                  <span className={classes.acctTxt}>
                    <i className='fa fa-chevron-down'></i>{this.state.user.balanceGrowth}</span>
                </div>
                <div className={classes.innBln}>
                  <span>Account Name: </span>
                  <span className={classes.acctTxt}>{this.state.user.account.accountName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
