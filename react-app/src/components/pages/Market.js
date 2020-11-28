import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import NewsList from '../NewsList.js';
import Header from "../Header.js";
import { Button, ButtonGroup, colors, Container, LinearProgress, TextField } from '@material-ui/core';
import OutlinedCard from '../OutlinedCard.js';
import CheckboxList from '../Watchlist.js';
import LineChart from '../Linechart.js';
import Fourohone from '../fourohone.js';
import LineChartB from '../lineChartB.js';


const styles = {
    main: {
      display: 'flex',
      flexWrap: 'wrap',
      position: 'absolute',
      width: '90%',
      height: '60%',
      justifyContent: 'space-around',
      margin: '2%',
      zIndex: 2
    },
    font: {
      fontSize: 18,
      margin: '2%',
      fontWeight: 'bold',
    },
    popStockContainer: {
      display: 'wrap',
      position: 'relative',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      width: '55%',
      height: '50%',
      borderRadius: '10px',
      background: '#393b41',
      color: '#fff',
      margin: '.5%',
    },
    watchListContainer: {
        display: 'wrap',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        width: '35%',
        height: '92%',
        overflowY: 'auto',
        borderRadius: '10px',
        background: '#393b41',
        color: '#fff',
        margin: '.5%',
      },
    newsContainer: {
      width: '35%',
      height: '92%',
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
      // display: 'wrap',
      overflowY: 'auto',
      paddingTop: 20,
      wrap: 'wrap',
      flexDirection: 'column',
      flexWrap: 'wrap',
      width: '55%',
      height: '90%',
      borderRadius: '10px',
      position: 'relative',
      background: '#393b41',
      color: '#fff',
      margin: '.5%'
    },
    oCard: {
      margin: '10%'
    },
    ticker: {
      display: 'inline-block',
     '&:hover':{
        color: '#6C9FF8',
        cursor: 'pointer'
      },
    },
    smallFont: {
      fontSize: '14px',
      marginRight: '1rem',
      marginLeft: '1rem'
    },
    controller: {
      float: 'right',
      marginRight: '1rem'
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

class Market extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            chartName: undefined,
            chartTicker: undefined,
            chartPrice: undefined,
            chartGrowth: undefined,
            session_id: this.props.session_id,
            day_start: undefined,
            day_end: undefined,
            query: window.location.href.slice(29),
            stockData: undefined,
            reload: false,
            watchlist: undefined,
            popStocks: undefined
        };
    }

    readStock = async(event) => {
      //should be get request with query param as id

      if(!this.state.query) {
        const response = await fetch(`/stock-data?search=D35-C`);
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
      }
      else {
        const response = await fetch(`/stock-data?search=${this.state.query}`);
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
      }

    }

    componentDidMount() {

      // this.setState({session_id: this.props.session_id});

      this.callPopStock()
      .then(res => this.setState({popStocks: res}))
      .catch(err => console.log(err));

      this.readStock()
      .then(res => this.setState({ stockData: res[0]}))
      .catch(err => console.log(err));

      this.callBackendAPI()
        .then(res => this.setState({user:res, watchlist:res.watchlist}))
        .catch(err => console.log(err));
    }

    callPopStock = async() => {
      const response = await fetch('/pop-stock-data');
      const body = await response.json();
      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

    handleLog = data => {
      console.log(data)
      // if(this.state.watchlist) {
      //   if(this.state.watchlist.length !== data.watchlist.length) {
      //     this.setState({watchlist: data.watchlist});
      //   } else {
      //     return;
      //   }
      // }
    }

    handleReRender = data => {
      if(!this.state.reload) {
        this.setState({reload: true});
      }
    }

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

        if(!this.props.session_id) {
          return (
            <div>
              <h1 className={classes.fourohone}>401 Not Authorized.</h1>
              <a className={classes.li} href='/login'>Return to Login</a>
              <Fourohone />
            </div>
          );
        }

        if(!this.state.user || !this.state.popStocks) {
          return (

            <div>
                <h1>   Loading   </h1>
                <LinearProgress/>
            </div>
          );
        }
        return (
            <div>

            <Header currentPage={`Market`} userName={this.state.user.username}/>
            <div className={classes.main}>
              <div className={classes.chartContainer}>
              <br />
              <LineChart className={classes.chart} q={this.state.query} onChange={this.handleLog}/>
              </div>
              <div className={classes.newsContainer}>
                <p className={classes.font}>Market News</p>
                <NewsList />
              </div>
              <div className={classes.popStockContainer}>
              <h3 className={classes.font}>Popular Stocks</h3>
              <div>
                  {this.state.popStocks.map(stock => (
                    <OutlinedCard stock={stock}/>
                  ))}
              </div>
              </div>

              <div className={classes.watchListContainer}>
              <h3 className={classes.font}>Watchlist</h3>
              <CheckboxList onChange={this.handleLog}/>
              </div>

            </div>
            </div>
        );
    }
};

export default withStyles(styles)(Market);
