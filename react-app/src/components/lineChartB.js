import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import Chart from "chart.js";
import { Button, ButtonGroup, colors, Container, LinearProgress, TextField } from '@material-ui/core';

const styles = {
  font: {
    margin: '2%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    overflow: 'hidden',
    borderRadius: '10px',
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
    margin: '2%'
  },
  smallFont: {
    fontSize: '14px',
    marginRight: '1rem',
    marginLeft: '1rem'
  },
  titleFont: {
    fontSize: '24px',
    marginRight: '1rem',
    marginLeft: '1rem',
    fontWeight: 'bold'
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

class LineChartB extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
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
        },
          query: window.location.href.slice(29),

      };
  }
  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  handleWatchSave = async(value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    };
    await fetch('/addWatchItem', requestOptions);
  }

  componentDidMount() {
    console.log(this.props.stockData);
    // this.setState({stockData: this.props.cData});

    const ctx = document.getElementById("marketChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1','Day 2','Day 3','Day 4'],
        datasets: [
          {
            label: "Past 4 Days",
            data: [this.state.stockData.prev_close, this.state.stockData.open, this.state.stockData.historical[0],this.state.stockData.historical[1]],
            backgroundColor: '#6C9FF8',
            borderColor: '#35363C',
            borderWidth: 1
          }
        ]
      }
    });
    console.log(this.state.stockData)
  }

  render() {
    const { classes } = this.props;
      return (
        <div className="App">
        <span className={classes.titleFont} >{this.state.stockData.name}</span>
        <span className={classes.ticker}><i onClick={() => this.handleWatchSave(this.state.stockData.symbol)} className="fa fa-bookmark"></i></span>
        <div className={classes.chartContainer}>
                <span className={classes.smallFont}>{this.state.stockData.symbol}</span>
                <span className={classes.font}>Market Rate: ${this.state.stockData.quote}</span>
                <span className={classes.font}>Daily Volume: {this.state.stockData.volume}</span>
                <ButtonGroup className={classes.controller}>
                  <Button variant="outlined" size="small" color="primary" className={classes.margin}>4 Day</Button>
                  <Button variant="outlined" size="small" color="primary" className={classes.margin}>Historical</Button>
                </ButtonGroup>
          <div className={classes.chart}>
            <canvas id="marketChart"/>
          </div>
        </div>
        </div>
      );
    }
  }

export default withStyles(styles)(LineChartB);
