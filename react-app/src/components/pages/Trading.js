import React from 'react';
import { Button, ButtonGroup, Container, LinearProgress, TextField } from '@material-ui/core';
import Header from "../Header";
import  { Breakpoint } from 'react-socks';
import '../css/Trading.css'
import { withStyles } from '@material-ui/styles';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Fourohone from '../fourohone.js';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
   input: {
      fullWidth: true,
      background: '#393b41',
      width: 300,
      color: 'white'
    },
    wrapper: {
      background: '#393b41',
      overflowY: 'auto',
      height: '100%',
      color: '#fff',
      borderRadius: '10px',
      margin: "1%",
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      alignText: 'center',
      textDecoration: 'none',
      listStyleType: 'none'
    },
    wrapper2: {
      background: '#393b41',
      overflowY: 'auto',
      height: '100%',
      color: '#fff',
      borderRadius: '10px',
      margin: "1%",
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      alignText: 'center'
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(3),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 3),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
        margin: '2% auto',
        marginLeft: 10,
        display: 'inline-block'
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
    },
    tradingPanel: {
        background: "#393b41",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        listStyleType: "none",
        borderRadius: "15px",
        padding: "2em"
    }
  });

class Trading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            quantity: 0,
            orderBuy: false,
            orderSell: false,
            completeBtn: false,
            search_symbol: undefined,
            stock_found: undefined,
            isStockFound: false,
            session_id: null,
            limit_price: 0
          };
    }



    componentDidMount() {

        this.setState({session_id: this.props.session_id});
        this.callBackendAPI()
          .then(res => this.setState({ user: res }))
          .catch(err => console.log(err));
    }

    updateComponentSell = async () => {

        let symbol = this.state.stock_found.symbol;
        let quantity = this.state.quantity;
        let limit_price = this.state.limit_price;
        let target_url = "/sellStock";
        let requestOptions = {};

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ name: symbol, n: quantity , limit_price: limit_price})
        }

        await fetch(target_url, requestOptions);
        this.callBackendAPI()
          .then(res => this.setState({ user: res }))
          .catch(err => console.log(err));

    }

    updateComponentBuy = async () => {

        let symbol = this.state.stock_found.symbol;
        let quantity = this.state.quantity;
        let target_url = "/buyStock";
        let limit_price = this.state.limit_price;
        let requestOptions = {};

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ name: symbol, n: quantity , limit_price: limit_price})
        }

        await fetch(target_url, requestOptions);
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

    setQuantity = event => {
          this.setState ({
              quantity: event.target.value
          });
    }

    setSearch = event => {
        this.setState ({
        search_symbol: event.target.value
        });
    }

    setLimitPrice = event => {
        this.setState({
            limit_price:  parseFloat(event.target.value)
        });
    }

    handleBuyBtn = () =>{
        this.setState({
            orderBuy: true
        })
        this.setState({
            orderSell: false
        })
    }

    handleSellBtn = () =>{
        this.setState({
            orderSell: true
        })
        this.setState({
            orderBuy: false
        })
    }

    handleSearch = async (event) =>{
      if(event.charCode === 13) {
        if (!this.state.search_symbol){
            alert("Please enter a search term")
            return;
        }
        let url = `/stock-data?search=${this.state.search_symbol.toUpperCase()}`;
        const response = await fetch(url);
        const stock = await response.json();
        if (response.status !== 200) {
            throw Error(stock.message)
        }

        if (stock.length !== 0){
            this.setState ({
                stock_found: stock[0],
                isStockFound: true
            });
        }
        else{
            alert("Failed to find a stock with that symbol");
        }
        this.callBackendAPI()
          .then(res => this.setState({ user: res }))
          .catch(err => console.log(err));
    }
  }

  handleSearch2 = async (event) =>{
      if (!this.state.search_symbol){
          alert("Please enter a search term")
          return;
      }
      let url = `/stock-data?search=${this.state.search_symbol.toUpperCase()}`;
      const response = await fetch(url);
      const stock = await response.json();
      if (response.status !== 200) {
          throw Error(stock.message)
      }

      if (stock.length !== 0){
          this.setState ({
              stock_found: stock[0],
              isStockFound: true
          });
      }
      else{
          alert("Failed to find a stock with that symbol");
      }
      this.callBackendAPI()
        .then(res => this.setState({ user: res }))
        .catch(err => console.log(err));
}

    handleCompleteBtn = () =>{
        if (this.state.quantity <= 0 || this.state.limit_price <= 0){
            alert("Please enter a valid quantity and limit price");
            return;
        }
        if (!this.state.stock_found){
            alert("No Stock Selected")
            return;
        }

        if (this.state.orderBuy){
            this.updateComponentBuy();
        }
        else if(this.state.orderSell){
            this.updateComponentSell();
        }
        else{
            alert("Please select an option");
        }
    }

    async cancelOrder(orderId){
        let target_url = "/cancelOrder";
        let requestOptions = {};

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(orderId)
        }

        await fetch(target_url, requestOptions);
        this.callBackendAPI()
          .then(res => this.setState({ user: res }))
          .catch(err => console.log(err));
    }

    render() {
      const { classes } = this.props;

        if(!this.state.session_id) {
            return (
              <div>
                <h1 className={classes.fourohone}>401 Not Authorized.</h1>
                <a className={classes.li} href='/login'>Return to Login</a>
                <Fourohone />
              </div>
            );
          }
        if(!this.state.user) {
            return (
                <div>
                    <h1>   Loading   </h1>
                    <LinearProgress/>
                </div>
            );
        }

        const account = (
          <React.Fragment>
            <h2>Ready to trade, {this.state.user.name}?</h2>
            <h3>Account: {this.state.user.account.accountName}</h3>
            <p>Account Balance: {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance)
            + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</p>
          </React.Fragment>
        );

        const tradingPanel = (
          <ul>
          <br/>
          {!this.state.stock_found && (
              <TextField label="Enter a stock symbol" variant="outlined" InputProps={{className: classes.input,
                 startAdornment: <SearchIcon style={{paddingRight: "3%"}} />}} onChange={this.setSearch} onKeyPress={this.handleSearch}
                 value={this.state.search_symbol}/>
          )}
          {this.state.isStockFound && (
              <React.Fragment>
                <details style={{width: "80%"}}>
                  <summary style={{background: "cornflowerblue"}}>
                      {`${this.state.stock_found.name}`}
                  </summary>
                  <div className={classes.wrapper}>
                    <h4>Quote: ${this.state.stock_found.quote}</h4>
                    <h4>Volume: {this.state.stock_found.volume}</h4>
                    <h4>Market: {this.state.stock_found.market}</h4>
                    <br/>
                    <Button style={{background: "aliceblue"}} onClick={() =>{
                        this.setState({
                            isStockFound: false,
                            stock_found: undefined
                        })
                    }}>Cancel</Button>
                  </div>
                </details>
                <TextField label="Quantity" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setQuantity} value={this.state.quantity}/>
                <br />
                <TextField label="Limit Price" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setLimitPrice} value={this.state.limit_price}/>
                <br />
                <br />
                <ButtonGroup disableElevation variant="outlined"  id="option-group" >
                    <Button  style={this.state.orderBuy ? {background: "#2ed47a"}:{background: "aliceblue"}} onClick={this.handleBuyBtn}>Buy</Button>
                    <Button  style={this.state.orderSell ? {background: "indianred"}:{background: "aliceblue"}} onClick={this.handleSellBtn}>Sell</Button>
                </ButtonGroup>
                <br/>
                <br/>
                <Button style={{background: "aliceblue"}} onClick={this.handleCompleteBtn}>Complete Transaction</Button>
              </React.Fragment>
              )}
          </ul>
        );

        const holdingPanel = (
          <ul className={classes.wrapper}>
              <h4>Current Holding</h4>
              {this.state.user.ownedStocks.map(stock => (
                  <details>
                      <summary>{stock.name}</summary>
                      <li className="stock-holding">
                          <p>Symbol: {stock.symbol}</p>
                          <p>Shares Owned: {stock.share}</p>
                          <p>Average Cost: {stock.average_cost}</p>
                          <Button className="buyBtn"
                          onClick={()=>{
                              this.setState({
                                  search_symbol: stock.symbol
                              }, () =>{
                                  this.handleSearch2();
                                  this.handleBuyBtn();
                              })
                          }}>Buy</Button>
                          <Button className="sellBtn"
                          onClick={()=>{
                              this.setState({
                                  search_symbol: stock.symbol
                              }, () =>{
                                  this.handleSearch2();
                                  this.handleSellBtn();
                              })
                          }}>Sell</Button>
                      </li>
                  </details>
              ))}
          </ul>
        )

        const stockList = (
          <ul className={classes.wrapper}>
              <h4>Open Orders</h4>
              <React.Fragment>
                  {this.state.user.openOrders.map(stock => (
                      <details>
                      <summary>Type: {stock.orderType} ---- Name: {stock.name} </summary>
                      <li id={stock.name} className="stock-holding">
                          <p>{stock.orderType} {stock.share} share(s) of {stock.name} for limit price of ${stock.limitPrice}</p>
                          <Button onClick={() => {this.cancelOrder(stock.orderId)}}>Cancel Order</Button>
                      </li>
                  </details>
                  ))}
              </React.Fragment>
          </ul>
        )

        return (
          <React.Fragment>
            <Header currentPage={`Trading`} userName={this.state.user.username}/>
            <Breakpoint medium up>
              <Container>
                <Grid container>
                  <Grid item xs={6}>
                    <Container className={classes.wrapper2}>
                      {account}
                      {tradingPanel}
                    </Container>
                  </Grid>
                  <Grid style={{marginBottom: "10%"}}item xs={6}>
                    <Container>
                      {holdingPanel}
                    </Container>
                    <Container>
                      {stockList}
                    </Container>
                  </Grid>
                </Grid>
              </Container>
            </Breakpoint>
            <Breakpoint small down>
              <Container>
                <Grid container>
                  <Grid item xs={12}>
                    <Container className={classes.wrapper2}>
                      {account}
                      {tradingPanel}
                    </Container>
                  </Grid>
                  <Grid style={{marginBottom: "10%", marginTop: "10%"}}item xs={12}>
                    <Container>
                      {holdingPanel}
                    </Container>
                    <Container>
                      {stockList}
                    </Container>
                  </Grid>
                </Grid>
              </Container>
            </Breakpoint>
          </React.Fragment>
        );
    }
  }

  export default withStyles(styles)(Trading);
