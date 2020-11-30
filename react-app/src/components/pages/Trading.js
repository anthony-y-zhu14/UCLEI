import { Button, ButtonGroup, LinearProgress, TextField } from '@material-ui/core';
import React from 'react';
import Header from "../Header";
import '../css/Trading.css'
import { withStyles } from '@material-ui/styles';
import Fourohone from '../fourohone.js';


const styles = {
   input: {
      fullWidth: true,
      background: '#393b41',
      width: 300,
      color: 'white'
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
  }

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

    handleSearch = async () =>{        
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

        if(!this.state.user && !this.state.session_id) {
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

        if(!this.state.session_id) {
            return (
              <React.Fragment className={classes.error}>
                <h1>401 Not Authorized.</h1>
                <a href='/login'>Go back to Login</a>
              </React.Fragment>
            );
          }

        return (
            <div>
                    <Header currentPage={`Trading`} userName={this.state.user.username}/>
                    <div id="main">
                        <div id="trade-container">
                            <ul className={classes.tradingPanel}>                                                        
                            <br/>
                            <h2 id="account-container" type="text">Account: {this.state.user.account.accountName}</h2>
                            <br/>

                            <div id="fundsAvialable">
                                <span style={{width: "80%"}}>Cash Balance: </span>
                                <span id="cash">{"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}</span>
                            </div>
                            <br/>                     
                            {!this.state.stock_found && (
                                <div>
                                    <TextField label="Enter a stock symbol" variant="outlined" InputProps={{className: classes.input}} onChange={this.setSearch} value={this.state.search_symbol}/>
                                    <Button id="searchBtn" onClick={this.handleSearch}><i className='fa fa-search'></i></Button>
                                </div>
                            )}

                            {this.state.isStockFound && (                             
                                                            
                                    <details>
                                        <summary style={{background: "cornflowerblue"}}>
                                            {`${this.state.stock_found.name}`}
                                        </summary>
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
                                    </details>   
                                                                                                                                                                                               
                                )}

                            <TextField label="Quantity" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setQuantity} value={this.state.quantity}/>
                            <TextField label="Limit Price" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setLimitPrice} value={this.state.limit_price}/>
                            <ButtonGroup disableElevation variant="outlined"  id="option-group" className={classes.button}>
                                <Button  style={this.state.orderBuy ? {background: "#2ed47a"}:{background: "aliceblue"}} onClick={this.handleBuyBtn}>Buy</Button>
                                <Button  style={this.state.orderSell ? {background: "indianred"}:{background: "aliceblue"}} onClick={this.handleSellBtn}>Sell</Button>
                            </ButtonGroup>
                            <br/>
                            <br/>
                            <Button id="CompleteTransactionBtn" onClick={this.handleCompleteBtn}>Complete Transaction</Button>
                            </ul>    
                        </div>
                        <div id="holding-container">
                            <ul id="stock-list">
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
                                                    this.handleSearch(); 
                                                    this.handleBuyBtn(); 
                                                })                                                                    
                                            }}>Buy</Button>
                                            <Button className="sellBtn"
                                            onClick={()=>{
                                                this.setState({
                                                    search_symbol: stock.symbol                                                    
                                                }, () =>{
                                                    this.handleSearch(); 
                                                    this.handleSellBtn(); 
                                                })                                                 
                                            }}>Sell</Button>
                                        </li>
                                    </details>                                    
                                ))}                                
                            </ul>
                            <ul id="stock-list">
                                <h4>Open Orders</h4>
                                <React.Fragment>
                                    {this.state.user.openOrders.map(stock => (
                                        <details>
                                        <summary>Type: {stock.orderType} ---- Name: {stock.name} </summary>
                                        <li id={stock.name} className="stock-holding">
                                            <p>{stock.orderType} {stock.share} share(s) of {stock.name} for limit price of ${stock.limitPrice}</p>
                                            <Button onClick={() => {this.cancelOrder(stock.orderId)}}>Cencel Order</Button>
                                        </li>                                       
                                    </details>
                                    ))}
                                </React.Fragment>
                            </ul>
                        </div>                       
                    </div>
            </div>

        );
    }
  }

  export default withStyles(styles)(Trading);
