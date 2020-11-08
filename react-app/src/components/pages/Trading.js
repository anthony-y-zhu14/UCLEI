import { Button, ButtonGroup, colors, Container, TextField } from '@material-ui/core';
import React from 'react';
import Header from "../Header";
import '../css/Trading.css'
import { withStyles } from '@material-ui/styles';

const styles = {
   input: {
      fullWidth: true,
      background: '#393b41',
      width: 300,
      color: 'white'
    },
    button: {
        margin: '3.5% auto',
        marginLeft: '10%'

    }
  }



class Trading extends React.Component {

    constructor() {
        super();
        this.state = {
            user: undefined,
            quantity: undefined,
            orderBuy: false,
            orderSell: false,
            completeBtn: false,
            search_symbol: undefined,
            stock_found: undefined,
            isStockFound: false
          };
    }

    componentDidMount() {
        this.callBackendAPI()
          .then(res => this.setState({ user: res }))
          .catch(err => console.log(err));
    }

    updateComponentSell = async () => {

        let symbol = this.state.stock_found.symbol;
        let quantity = this.state.quantity;
        let target_url = "/sellStock";

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ name: symbol, n: quantity })
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

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ name: symbol, n: quantity })
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

    handleBuyBtn = (e) =>{
        this.setState({
            orderBuy: true
        })
        this.setState({
            orderSell: false
        })
    }

    handleSellBtn = (e) =>{
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
        let url = `/stock-data?search=${this.state.search_symbol}`;
        const response = await fetch(url);
        const stock = await response.json();
        if (response.status !== 200) {
            throw Error(stock.message)
          }

        this.setState ({
            stock_found: stock[0],
            isStockFound: true
        });

        console.log(this.state.stock_found);

    }

    handleCompleteBtn = (e) =>{
        if (this.state.quantity <= 0){
            alert("Please enter a valid quantity")
            return;
        }
        if (!this.state.stock_found){
            alert("No Stock Selected")
            return;
        }
        if (this.state.orderBuy){
            this.updateComponentBuy();

        }
        else {
            this.updateComponentSell();
        }


    }




    render() {
        const { classes } = this.props;

        if(!this.state.user) {
            return (
              <h1>Loading...</h1>
            );
        }

        return (
            <div>
                    <Header currentPage={`Trading`} userName={this.state.user.username}/>
                    <Container id="main">

                        <Container id="trade-container">

                            <br />
                            <div id="accoxwunt-container" type="text">{this.state.user.account.accountName}</div>
                            <br/>


                            <div id="fundsAvialable">
                                <span style={{width: "80%"}}>Cash Balance: </span>
                                <span id="cash">{"$" + (Math.round( parseFloat(this.state.user.account.cashBalance) * 100) / 100).toFixed(2)}</span>
                            </div>




                            <div>
                                <TextField label="Enter a stock symbol" variant="outlined" InputProps={{className: classes.input}} onChange={this.setSearch} value={this.state.search_symbol}/>

                                <Button id="searchBtn" onClick={this.handleSearch}><i class='fa fa-search'></i></Button>
                            </div>






                            {this.state.isStockFound && (
                                    <div id={this.state.stock_found.name} className="stock-holding">{this.state.stock_found.name}</div>
                                )}




                            <div>
                                <TextField label="Quantity" variant="outlined" InputProps={{className: classes.input}} onChange={this.setQuantity} value={this.state.quantity}/>
                                <ButtonGroup variant='contained' className={classes.button}>
                                    <Button id="buyBtn" style={this.state.orderBuy ? {background: "#2ed47a"}:{background: "aliceblue"}} onClick={this.handleBuyBtn}>Buy</Button>
                                    <Button id="sellBtn" style={this.state.orderSell ? {background: "indianred"}:{background: "aliceblue"}} onClick={this.handleSellBtn}>sell</Button>
                                </ButtonGroup>
                            </div>





                            <br />
                            <br />
                            <br />
                            <Button id="CompleteTransactionBtn" onClick={this.handleCompleteBtn}>Complete Transaction</Button>



                        </Container>

                        <Container id="holding-container">

                            <ul id="stock-list">
                                Current Holding
                                <React.Fragment>
                                    {this.state.user.ownedStocks.map(stock => (
                                        <li id={stock.name} className="stock-holding">{stock.name}</li>
                                    ))}
                                </React.Fragment>
                            </ul>


                        </Container>


                    </Container>






        </div>


        );
    }
  }

  export default withStyles(styles)(Trading);
