import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Chart from "chart.js";

const styles = {
  font: {
    margin: '2%',
    fontSize: "100%",
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
    fontSize: '70%',
    marginRight: '1%',
    marginLeft: '1%'
  },
  titleFont: {
    fontSize: '100%',
    marginRight: '1%',
    marginLeft: '1%',
    fontWeight: 'bold'
  },
  controller: {
    float: 'right',
    marginRight: '1%'
  },
  fourohone: {
    marginLeft: '2%',
    color: '#000'
  },
  li: {
    marginLeft: '2%',
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
          stockData: this.props.cData[0],
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

  makeChart = async (d) => {

    function createData(date, quote) {
      return { date, quote };
    }

    let data = [];
    for(let entry of Object.entries(this.state.stockData.historical)) {
      data.push(entry);
    }
    let rows = data.map(stock => (
        createData(`${stock[0]}`, stock[1])
      ));

    if(this.state.stockData) {

      const ctx = document.getElementById("marketChart");

      if (window.ctx !== undefined) {
        window.ctx.destroy();
      }
      window.ctx = new Chart(ctx, {
        type: 'line',
        data: {
          labels: rows.map((row) => ( row.date)),
          datasets: [
            {
              label: "Quote: CAD $",
              data: rows.map((row) => ( row.quote)),
              backgroundColor: '#6C9FF8',
              borderColor: '#35363C',
              borderWidth: 1
            }
          ]
        }
      });
    }
  }

  componentDidMount() {
    this.makeChart(this.state.stockData.name);
  }



  render() {
    const { classes } = this.props;
      return (
        <div className="App">
        <div className={classes.chartContainer}>
                <span className={classes.titleFont} >{this.state.stockData.name}</span>
                <span className={classes.smallFont}>{this.state.stockData.symbol}</span>
                <br />
                <span className={classes.font}>Market Rate: ${this.state.stockData.quote}</span>
                <span className={classes.font}>Daily Volume: {this.state.stockData.volume}</span>
          <div className={classes.chart}>
            <canvas id="marketChart"/>
          </div>
        </div>
        </div>
      );
    }
  }

export default withStyles(styles)(LineChartB);
