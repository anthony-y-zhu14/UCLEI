import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import NewsList from '../NewsList.js';
import Header from "../Header.js";
import OutlinedCard from '../OutlinedCard.js';
import CheckboxList from '../Watchlist.js';
import LineChart from '../Linechart.js';
import SpacingGrid from '../ChartGrid.js';

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
    }
  };

class Market extends React.Component {
    constructor() {
        super();
        this.state = {
            user: undefined
        };
    }

    componentDidMount() {
      this.callBackendAPI()
        .then(res => this.setState({ user: res }))
        .catch(err => console.log(err));
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
              <SpacingGrid className={classes.chartContainer}>
              <h3 className={classes.font}>NASDAQ</h3>
              <p>I'm going to haves stock information </p>
              <p>I'm going to have buttons too!</p>
              <LineChart />
              </SpacingGrid>
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
              <CheckboxList />
              </div>

            </div>
            </div>
        );
    }
};

export default withStyles(styles)(Market);
