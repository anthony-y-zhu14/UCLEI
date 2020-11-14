import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import NewsList from '../NewsList.js';
import Header from "../Header.js";
import { Button, ButtonGroup, colors, Container, LinearProgress, TextField } from '@material-ui/core';
import OutlinedCard from '../OutlinedCard.js';
import CheckboxList from '../Watchlist.js';
import LineChart from '../Linechart.js';
import Fourohone from '../fourohone.js';

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
      margin: '2%',
      fontSize: 18,
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
      justifyContent: 'center',
      borderRadius: '10px',
      position: 'relative',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      background: '#393b41',
      color: '#fff',
      margin: '.5%'
    },
    chartContainer: {
      // display: 'wrap',
      overflow: 'hidden',
      paddingTop: 20,
      wrap: 'wrap',
      flexDirection: 'column',
      flexWrap: 'wrap',
      width: '55%',
      height: '100%',
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
    chart: {
      margin: '15%'
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
            session_id: null,
            day_start: undefined,
            day_end: undefined,
            query: window.location.href.slice(29),
            stockData: undefined,
            reload: false
        };
    }

    readStock = async(event) => {
      //should be get request with query param as id
      const response = await fetch(`/stock-data?search=${this.state.query}`);
      const body = await response.json();
      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;    
    }

    componentDidMount() {
      this.setState({session_id: this.props.session_id});

      this.readStock()
      .then(res => this.setState({ stockData: res[0]}))
      .catch(err => console.log(err));

      this.callBackendAPI()
        .then(res => this.setState({user:res, chartName:res.ownedStocks[0].name, chartTicker:res.ownedStocks[0].symbol, chartPrice:res.ownedStocks[0].quote}))
        .catch(err => console.log(err));

    }
    handleWatchSave = async(value) => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
      };
      await fetch('/addWatchItem', requestOptions);

      this.callBackendAPI()
      .then(res => this.setState({ user: res }))
      .catch(err => console.log(err));
    }

    handleLog = data => {

      if(data.view) {
        if(this.state.chartName !== data.selectedStock[0].name) {
          this.setState({chartName: data.selectedStock[0].name});
        }
        if(this.state.chartTicker !== data.selectedStock[0].symbol) {
          this.setState({chartTicker: data.selectedStock[0].symbol});
        }
        if(this.state.chartPrice!== data.selectedStock[0].quote) {
          this.setState({chartPrice: data.selectedStock[0].quote});
        }
        if(this.state.chartGrowth !== data.selectedStock[0].percentage) {
          this.setState({chartGrowth: data.selectedStock[0].percentage});
        }
        if(this.state.day_start !== data.selectedStock[0].open) {
          this.setState({day_start: data.selectedStock[0].open});
        }
        if(this.state.day_end !== data.selectedStock[0].prev_close) {
          this.setState({day_end: data.selectedStock[0].prev_close});
        }
      }
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

        if(!this.state.user && !this.state.session_id) {
          return (
            <div>
              <h1 className={classes.fourohone}>401 Not Authorized.</h1>
              <a className={classes.li} href='/login'>Return to Login</a>
              <Fourohone />
            </div>
          );
        }

        if(!this.state.query) {
          return (

            <div>
            <Header currentPage={`Market`} userName={`Jerry`}/>
            <div className={classes.main}>
              <div className={classes.chartContainer}>
              <h5>   Loading   </h5>
              <LinearProgress/>
              </div>
              <div className={classes.newsContainer}>
                <h3 className={classes.font}>Market News</h3>
                <NewsList />
              </div>
              <div className={classes.popStockContainer}>
              <h3 className={classes.font}>Popular Stocks</h3>

              </div>

              <div className={classes.watchListContainer}>
              <h3 className={classes.font}>Watchlist</h3>
              <CheckboxList onChange={this.handleLog}/>
              </div>

            </div>
            </div>

          );
        }

        if(!this.state.stockData) {
          return (
            <div>
            <Header currentPage={`Market`} userName={`Jerry`}/>
            <div className={classes.main}>
              <div className={classes.chartContainer}>
              <span className={classes.font}>{this.state.chartName}</span>
              <span className={classes.smallFont}>{this.state.chartTicker}</span>
              {/* <span className={classes.ticker} id="addBtn"><i className={classes.ticker} onClick={() => this.handleWatchSave(this.state.chartTicker)} className="fa fa-bookmark"></i></span> */}
              {/* <ButtonGroup className={classes.controller}>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Day</Button>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Year</Button>
              </ButtonGroup> */}
              <br />
              <span className={classes.smallFont}>${this.state.chartPrice}</span>
              <span className={classes.smallFont}>{this.state.chartGrowth}</span>
              <LinearProgress/>
              </div>
              <div className={classes.newsContainer}>
                <h3 className={classes.font}>Market News</h3>
                <NewsList />
              </div>
              <div className={classes.popStockContainer}>
              <h3 className={classes.font}>Popular Stocks</h3>

              </div>

              <div className={classes.watchListContainer}>
              <h3 className={classes.font}>Watchlist</h3>
              <CheckboxList onChange={this.handleLog}/>
              </div>

            </div>
            </div>
          );
        }
        
        return (
            <div>         
              
            <Header currentPage={`Market`} userName={`Jerry`}/>
            <div className={classes.main}>
              <div className={classes.chartContainer}>
              <span className={classes.font}>{this.state.chartName}</span>
              <span className={classes.smallFont}>{this.state.chartTicker}</span>
              <span className={classes.ticker} id="addBtn"><i className={classes.ticker} onClick={() => this.handleWatchSave(this.state.chartTicker)} className="fa fa-bookmark"></i></span>
              <ButtonGroup className={classes.controller}>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Day</Button>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Year</Button>
              </ButtonGroup>
              <br />
              <span className={classes.smallFont}>${this.state.chartPrice}</span>
              <span className={classes.smallFont}>{this.state.chartGrowth}</span>              
              <LineChart className={classes.chart} cData={this.state.stockData}/>              
              </div>
              <div className={classes.newsContainer}>
                <h3 className={classes.font}>Market News</h3>
                <NewsList />
              </div>
              <div className={classes.popStockContainer}>
              <h3 className={classes.font}>Popular Stocks</h3>

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
