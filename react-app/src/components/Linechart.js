import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Chart from "chart.js";
import { Button, ButtonGroup } from '@material-ui/core';
import FormDialog from './Dialog.js';
import BasicTable from './StockTable.js';
import Tooltip from '@material-ui/core/Tooltip';
import formatISO from 'date-fns/formatISO'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import FilterTable from './stockFilterTbl';


const styles = {
  font: {
    margin: '2%',
    fontSize: '80%',
    fontWeight: 'bold',
  },
  chartContainer: {
    overflow: 'hidden',
    borderRadius: '10px',
    background: '#202023',
    color: '#fff',
    margin: '1%',
    padding: '2%'
  },
  oCard: {
    margin: '10%'
  },
  hide: {
    display: 'none'
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
  back: {
    background: '#fff',
    borderRadius: 10
  },
  smallFont: {
    fontSize: '70%',
    marginRight: '1%',
    marginLeft: '1%'
  },
  titleFont: {
    fontSize: '85%',
    marginRight: '1%',
    marginLeft: '1%',
    fontWeight: 'bold'
  },
  controller: {
    float: 'right',
    marginRight: '1%'
  },
  fourohone: {
    marginLeft: '5%',
    color: '#000'
  },
  li: {
    marginLeft: '10%',
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
          display: 'none',
          vertical: 'bottom',
          horizontal: 'right',
          selectedStartDate: new Date('2020-12-01T21:11:54'),
          selectedEndDate: new Date('2020-12-01T21:11:54'),
          filterData: undefined,
          showFilter: false,
          showTable: true
      };
  }

  handleDateChange = (date) => {   
    this.setState({selectedStartDate: date});
  };

  handleDateChange2 = (date) => {   
    this.setState({selectedEndDate: date});
  };

  componentDidUpdate() {
    this.componentDidMount()
    if(this.state.query !== window.location.href.slice(29)) {
      this.setState({query: window.location.href.slice(29)});
    }
  }

  readFilter = async() => {
    let url;
    if(!this.state.query) {
      url = `/stocks/history/?symbol=D35-C&startDate=${formatISO(this.state.selectedStartDate, { representation: 'date'})}&endDate=${formatISO(this.state.selectedEndDate,{ representation: 'date'})}`
    } else {
      url = `/stocks/history/?symbol=${window.location.href.slice(29)}&startDate=${formatISO(this.state.selectedStartDate, { representation: 'date'})}&endDate=${formatISO(this.state.selectedEndDate,{ representation: 'date'})}`
    }
    const response = await fetch(url);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    this.setState({ filterData: body});
    // this.setState({showFilter: true});
    this.setState({showFilter: false});
    this.componentDidMount()
    return body;
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
      this.setState({showTable: true});
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
    this.setState({ filterData: undefined})

    this.makeChart(this.state.stockData.name);
    this.componentDidMount()

    return body;
  }

  handleWatchSave = (value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    };
    fetch('/addWatchItem', requestOptions)
    .then(this.componentDidMount())
    this.props.reloadWatchList()
  }

  handleChart = () => {
    this.setState( {showChart : true} );
    this.readStock();
  }

  handleTable = async() => {
    this.setState( {showChart : false} );
    this.readStock();

}

  componentDidMount() {

    if(this.state.q !== window.location.href.slice(29)) {
      this.setState({q: window.location.href.slice(29)});
      this.readStock();
    }
  }

    makeChart = async (d) => {

      function createData(date, quote) {
        return { date, quote };
      }

      let data = [];
      for(let entry of Object.entries(this.state.stockData.historical).reverse()) {
        if(data.length < 7) {
          data.push(entry);
        } else {
          break;
        }
      }
      let rows = data.reverse().map(stock => (
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

  render() {
    const { classes } = this.props;

    const filter = (
      <Grid container space={2} className={classes.back} style={{background: '#fff'}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid className={classes.back} item xs={4} style={{marginLeft: "5%"}}>
                        <KeyboardDatePicker
                          margin="normal"
                          value={this.state.selectedStartDate}
                          onChange={this.handleDateChange}
                          label="Start Date"
                          format="yyyy/MM/dd"
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}            
                        />
                    </Grid>
                    <Grid className={classes.back} item xs={4}>
                    <KeyboardDatePicker
                          margin="normal"           
                          label="End Date"
                          value={this.state.selectedEndDate}
                          onChange={this.handleDateChange2}
                          format="yyyy/MM/dd"
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}            
                        />    
                    </Grid>   
                </MuiPickersUtilsProvider>
                <Grid className={classes.back} item xs={2} style={{marginTop: '2.5%'}}>
                   <Button variant="contained" onClick={this.readFilter} style={{color: "primary", marginLeft: "20% auto"}} >Submit</Button> 
                </Grid>
              </Grid>
              
    );

    if(!this.state.stockData) {
      return (
        <h1>Loading</h1>
      );
    }

    else if(this.state.stockData && !this.state.filterData) {
      return (
        <div className={classes.chartContainer}>
        <div className="App">
          <span className={classes.titleFont} >{this.state.stockData.name}</span>
          <span className={classes.smallFont}>{this.state.stockData.symbol}</span>

          <Tooltip title="Save to Watchlist">
            <span className={classes.ticker}><i onClick={(event) => {
              this.handleWatchSave(this.state.stockData.symbol);
              this.setState({display: 'block'});
            }}
             className="fa fa-bookmark"></i></span>
           </Tooltip>
           <div className={classes.ticker}>
           <FormDialog name={this.state.stockData.name}/>
          </div>
              <br />
              <span className={classes.font}>Market Rate: ${this.state.stockData.quote}</span>
              <span className={classes.font}>Daily Volume: {this.state.stockData.volume}</span>
              <br />
              <span className={classes.font}>Today's High: ${this.state.stockData.daily_range.high}</span>
              <span className={classes.font}>Today's Low: ${this.state.stockData.daily_range.low}</span>
              <ButtonGroup className={classes.controller}>
                <Button variant="outlined" size="small" color="primary" onClick={this.handleChart} className={classes.margin}>Week</Button>
                <Button variant="outlined" size="small" color="primary" onClick={this.handleTable} className={classes.margin}>Historical</Button>
              </ButtonGroup>

          <div className={classes.chart}>
            {this.state.showChart? <canvas id="marketChart"/> : <React.Fragment>{filter} <BasicTable stockData = {this.state.stockData}/> </React.Fragment> }

          </div>
        </div>
        <div className={classes.hide}>
          <canvas id="marketChart"/>
        </div>
        </div>
      );
    } else {
      return (
        <div className={classes.chartContainer}>
        <div className="App">
          <span className={classes.titleFont} >{this.state.stockData.name}</span>
          <span className={classes.smallFont}>{this.state.stockData.symbol}</span>

          <Tooltip title="Save to Watchlist">
            <span className={classes.ticker}><i onClick={(event) => {
              this.handleWatchSave(this.state.stockData.symbol);
              this.setState({display: 'block'});
            }}
             className="fa fa-bookmark"></i></span>
           </Tooltip>
           <div className={classes.ticker}>
           <FormDialog name={this.state.stockData.name}/>
          </div>
              <br />
              <span className={classes.font}>Market Rate: ${this.state.stockData.quote}</span>
              <span className={classes.font}>Daily Volume: {this.state.stockData.volume}</span>
              <br />
              <span className={classes.font}>Today's High: ${this.state.stockData.daily_range.high}</span>
              <span className={classes.font}>Today's Low: ${this.state.stockData.daily_range.low}</span>
              <ButtonGroup className={classes.controller}>
                <Button variant="outlined" size="small" color="primary" onClick={this.handleChart} className={classes.margin}>Week</Button>
                <Button variant="outlined" size="small" color="primary" onClick={this.handleTable} className={classes.margin}>Historical</Button>
              </ButtonGroup>

          <div className={classes.chart}>
            {this.state.showChart? <canvas id="marketChart"/> : <React.Fragment>{filter} <FilterTable stockData = {this.state.filterData}/> </React.Fragment> }
          </div>
        </div>
        <div className={classes.hide}>
          <canvas id="marketChart"/>
        </div>
        </div>
      );
    }

 
    }
  }

export default withStyles(styles)(LineChart);
