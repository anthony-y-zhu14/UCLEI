import React from 'react';
import GridList from "../GridList.js";
import Header from "../Header.js";
import SpacingGrid from "../Grid.js";
import SimpleContainer from "../Container.js";
import NewsList from '../NewsList.js';
import Typography from '@material-ui/core/Typography';

import { withStyles } from "@material-ui/core/styles";

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
  }
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
      // session_id: undefined
    };
  };

  //this.props.location.state.session_id

  componentDidMount() {
    // this.setState({session_id: this.props.location.state.session_id})
    // Calls our fetch below once the component mounts
    
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


    if(!this.state.user) {
      return (
        <h1>Loading...</h1>
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
};

export default withStyles(styles)(Dashboard);
