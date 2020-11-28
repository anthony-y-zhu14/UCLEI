import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import Chart from "chart.js";
import { Button, ButtonGroup, colors, Container, LinearProgress, TextField } from '@material-ui/core';
import FormDialog from './Dialog.js';
import BasicTable from './StockTable.js';

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

class LineChart extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          stockData: undefined,
          query: undefined,
          q: undefined,
          showChart: true,
      };
  }
  componentDidUpdate() {
    this.componentDidMount()
    if(this.state.query !== window.location.href.slice(29)) {
      this.setState({query: window.location.href.slice(29)});
    }
  }

  readStock = async() => {
    //should be get request with query param as id
    if(window.location.href.slice(29) === "") {
      const response = await fetch(`/stock-data?search=D35-C`);
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message)
      }
      this.setState({ stockData: body[0]})
      this.makeChart(this.state.stockData.name);
      this.componentDidMount()

      return body;
    }
    const response = await fetch(`/stock-data?search=${window.location.href.slice(29)}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    this.setState({ stockData: body[0]})
    this.makeChart(this.state.stockData.name);
    this.componentDidMount()

    return body;
  }

  handleWatchSave = async(value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    };
    await fetch('/addWatchItem', requestOptions);
    this.componentDidMount();
  }

  handleChart = async() => {
    // this.setState( {showTable: false} );
    this.setState( {showChart : true} );
    this.readStock();
  }

  handleTable = async() => {
    this.setState( {showChart : false} );
}

  componentDidMount() {

    if(this.state.q !== window.location.href.slice(29)) {
      this.setState({q: window.location.href.slice(29)});
      this.readStock();
    }
  }

    makeChart = async (d) => {
      if(this.state.stockData) {

        const ctx = document.getElementById("marketChart");

        if (window.ctx !== undefined) {
          window.ctx.destroy();
        }
        window.ctx = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Day 1','Day 2','Day 3','Day 4', 'Day 5'],
            datasets: [
              {
                label: "Week",
                data: [this.state.stockData.prev_close, this.state.stockData.open, this.state.stockData.historical[0],this.state.stockData.historical[1]],
                backgroundColor: '#6C9FF8',
                borderColor: '#35363C',
                borderWidth: 1
              }
            ]
          }
        });
      }
    }

  render() {
    const { classes } = this.props;

    if(!this.state.stockData) {
      return (
        <h1>Loading</h1>
      );
    }

      return (
        <div className="App">
          <span className={classes.titleFont} >{this.state.stockData.name}</span>
          <span className={classes.ticker}><i onClick={() => this.handleWatchSave(this.state.stockData.symbol)}
           className="fa fa-bookmark"></i></span>

           <div className={classes.ticker}>
           <FormDialog name={this.state.stockData.name}/>
           </div>


        <div className={classes.chartContainer}>
                <span className={classes.smallFont}>{this.state.stockData.symbol}</span>
                <span className={classes.font}>Market Rate: ${this.state.stockData.quote}</span>
                <span className={classes.font}>Daily Volume: {this.state.stockData.volume}</span>
                <ButtonGroup className={classes.controller}>
                  <Button variant="outlined" size="small" color="primary" onClick={this.handleChart} className={classes.margin}>Week</Button>
                  <Button variant="outlined" size="small" color="primary" onClick={this.handleTable} className={classes.margin}>Historical</Button>
                </ButtonGroup>
          <div className={classes.chart}>
          {this.state.showChart ? <canvas id="marketChart"/> : <BasicTable stockData = {this.state.stockData}/>  }
          </div>
        </div>
        </div>
      );
    }
  }

export default withStyles(styles)(LineChart);
