import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import NewsList from '../NewsList.js';
import Header from "../Header.js";
import { Button, ButtonGroup, colors, Container, TextField } from '@material-ui/core';
import OutlinedCard from '../OutlinedCard.js';
import CheckboxList from '../Watchlist.js';
import LineChart from '../Linechart.js';

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
      margin: '2%'
    },
    popStockContainer: {
      display: 'wrap',
      position: 'absolute',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      width: '55%',
      height: '50%',
      borderRadius: '10px',
      position: 'relative',
      background: '#393b41',
      color: '#fff',
      margin: '.5%',
    },
    watchListContainer: {
        display: 'wrap',
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        width: '35%',
        height: '92%',
        overflowY: 'auto',
        borderRadius: '10px',
        position: 'relative',
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
      display: 'inline-block'
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
    }
  };

class Market extends React.Component {
    constructor() {
        super();
        this.state = {
            user: undefined,
            chartName: undefined,
            chartTicker: undefined,
            chartPrice: undefined,
            chartGrowth: undefined,
        };
    }

    componentDidMount() {
      this.callBackendAPI()
        .then(res => this.setState({user:res, chartName:res.ownedStocks[0].name, chartTicker:res.ownedStocks[0].symbol, chartPrice:res.ownedStocks[0].quote}))
        .catch(err => console.log(err));

    }

    handleLog = data => {
      console.log('boop')
      console.log(data);

      if(data.view) {
        if(this.state.chartName != data.selectedStock[0].name) {
          this.setState({chartName: data.selectedStock[0].name});
        }
        if(this.state.chartTicker != data.selectedStock[0].symbol) {
          this.setState({chartTicker: data.selectedStock[0].symbol});
        }
        if(this.state.chartPrice!= data.selectedStock[0].quote) {
          this.setState({chartPrice: data.selectedStock[0].quote});
        }
        if(this.state.chartGrowth != data.selectedStock[0].percentage) {
          this.setState({chartGrowth: data.selectedStock[0].percentage});
        }
        // , chartPrice: data.selectedStock[0].quote, chartTicker: data.selectedStock[0].symbol, chartGrowth: data.selectedStock[0].percentage})
      }
      else {
        console.log('error')
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

        return (
            <div>
            <Header currentPage={`Market`} userName={`Jerry`}/>
            <div className={classes.main}>
              <div className={classes.chartContainer}>
              <span className={classes.font}>{this.state.chartName}</span>
              <span className={classes.smallFont}>{this.state.chartTicker}</span>
              <span className={classes.ticker} id="addBtn"><i class="fa fa-bookmark"></i></span>
              <ButtonGroup className={classes.controller}>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Day</Button>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Month</Button>
                <Button variant="outlined" size="small" color="primary" className={classes.margin}>Year</Button>
              </ButtonGroup>
              <br />
              <span className={classes.smallFont}>${this.state.chartPrice}</span>
              <span className={classes.smallFont}>{this.state.chartGrowth}</span>
              <LineChart className={classes.chart}/>
              </div>
              <div className={classes.newsContainer}>
                <h3 className={classes.font}>Market News</h3>
                <NewsList />
              </div>
              <div className={classes.popStockContainer}>
              <h3 className={classes.font}>Popular Stocks</h3>
              <OutlinedCard className={classes.oCard}/>
              <OutlinedCard className={classes.oCard}/>
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
