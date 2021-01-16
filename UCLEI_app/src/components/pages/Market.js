import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import NewsList from '../NewsList.js';
import Header from "../Header.js";
import  { Breakpoint } from 'react-socks';
import { Container, LinearProgress } from '@material-ui/core';
import CheckboxList from '../Watchlist.js';
import LineChart from '../Linechart.js';
import Fourohone from '../fourohone.js';
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
    flexGrow: 1
  },
  section: {
    height: '40%'
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

      this.callPopStock()
      .then(res => this.setState({popStocks: res}))
      .catch(err => console.log(err));

      this.readStock()
      .then(res => this.setState({ stockData: res[0]}))
      .catch(err => console.log(err));

      this.callBackendAPI()
        .then(res => this.setState({user:res}))
        .then(() => this.setState({watchlist: this.state.user.watchlist}))
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

    delWatchItem = data => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: data })
      };
      fetch('/delWatchItem', requestOptions);
      // const data = await response.json();
  
      this.callBackendAPI()
      .then(res => this.setState({user:res}))
      .then(() => this.setState({watchlist: this.state.user.watchlist}))
      .catch(err => console.log(err));
  
    }


    updateList = () => {
      this.callBackendAPI()
      .then(res => this.setState({user:res}))
      .then(() => this.setState({watchlist: this.state.user.watchlist}))
    }

    render() {
        const { classes } = this.props;
        if(!this.props.session_id) {
          return (
            <React.Fragment>
              <h1 className={classes.fourohone}>401 Not Authorized.</h1>
              <a className={classes.li} href='/login'>Return to Login</a>
              <Fourohone />
            </React.Fragment>
          );
        }
        if(!this.state.watchlist) {
          return (
            <React.Fragment>
                <h1>   Loading   </h1>
                <LinearProgress/>
            </React.Fragment>
          );
        }

        return (
            <React.Fragment>
              <Header currentPage={`Market`} userName={this.state.user.username}/>
              <Breakpoint medium up>
                <Container>
                  <Grid container>
                      <Grid item xs={12}><LineChart reloadWatchList={this.updateList}/></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><CheckboxList w={this.state.user.watchlist} del={this.delWatchItem}/></Grid>
                    <Grid item xs={6}><NewsList /></Grid>
                  </Grid>
                </Container>
              </Breakpoint>
              <Breakpoint small down>
                <Container>
                  <Grid container>
                      <Grid item xs={12}><LineChart reloadWatchList={this.updateList}/></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <div style={{height: "300px", marginTop: "2%"}}>
                    <Grid item xs={12}><CheckboxList w={this.state.user.watchlist} del={this.delWatchItem}/></Grid>
                  </div>
                  </Grid>
                </Container>
              </Breakpoint>

            </React.Fragment>
        );
    }
};

export default withStyles(styles)(Market);
