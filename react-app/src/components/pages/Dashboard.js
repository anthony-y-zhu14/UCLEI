import React from 'react';
import Header from "../Header.js";
import { Button, ButtonGroup, Container } from '@material-ui/core';
import NewsList from '../NewsList.js';
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from '@material-ui/core';
import Fourohone from '../fourohone.js';
import LineChartB from '../lineChartB.js';
import LineChart from '../Linechart.js';


const styles = {
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'absolute',
    width: '90rem',
    height: '40rem',
    justifyContent: 'space-around',
    margin: '1rem',
    zIndex: 2
  },
  font: {
    fontSize: 18,
    margin: '.5rem',
    fontWeight: 'bold',
  },
  accountContainer: {
    display: 'wrap',
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '45rem',
    height: '14rem',
    borderRadius: 10,
    position: 'relative',
    background: '#393b41',
    color: '#fff',
    left: '-20rem',
    top: '-30rem'
  },
  breaker: {
    paddingTop: '3rem',
    paddingBottom: '1rem'
  },
  newsContainer: {
    width: '35rem',
    height: '60rem',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
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
    width: '45rem',
    height: '30rem',
    borderRadius: '10px',
    position: 'relative',
    background: '#393b41',
    color: '#fff',
    margin: '.5%'
  },
  button: {
    marginRight: '1.25rem',
    marginBottm: '.5rem',
    float: 'right',
    color: '#6C9FF8',
    background: "#393b41"
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
      stockData: undefined
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


  componentDidMount() {
  this.setState({session_id: this.props.session_id});

  this.readStock()
    .then(res => this.setState({ stockData : res } ))
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

    if(!this.state.user || !this.state.stockData) {
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
            <h3 className={classes.font}>At a Glance:</h3>
            <LineChartB className={classes.chart} cData={this.state.stockData}/>
            </div>
            <div className={classes.newsContainer}>
            <h3 className={classes.font}>Market News</h3>
            <div className={classes.breaker}>
            <NewsList />
            </div>
            </div>
            <div className={classes.accountContainer}>
            <h3 className={classes.font}>Account</h3>
              <div className={classes.acctBln}>
                <div className={classes.innBln}>
                  <span>Account Balance: </span>
                  <span className={classes.acctTxt}>{"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</span>
                </div>
                <div className={classes.innBln}>
                  <span>Investment Balance: </span>
                  <span className={classes.acctTxt}>{"$" + (Math.round( parseFloat(this.state.user.account.investmentBalance) * 100) / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className={classes.acctGrw}>

              <div className={classes.innBln}>
                <span>Account Name: </span>
                <span className={classes.acctTxt}>{this.state.user.account.accountName}</span>
              </div>

              <div className={classes.innBln}>
                <span>Account Growth: </span>
                <span className={classes.acctTxt}>
                  <i className='fa fa-chevron-down'></i>{this.state.user.balanceGrowth}%</span>
              </div>
              </div>
              <Button href='/account' className={classes.button}>
                View More
              </Button>
            </div>
          </div>
        </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
