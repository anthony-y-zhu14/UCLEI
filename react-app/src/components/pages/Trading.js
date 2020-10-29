import { Button, Container, TextField } from '@material-ui/core';
import React from 'react';
import Header from "../Header";
import '../css/Trading.css'


class Trading extends React.Component {
    constructor() {
        super();
        this.state = {
            user: undefined,
            buyBtn: false,
            sellBtn: false,
            completeBtn: false
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

    handleBuyBtn = (e) =>{
        this.setState({
            buyBtn: true
        })
        this.setState({
            sellBtn: false
        })
    }

    handleSellBtn = (e) =>{
        this.setState({
            sellBtn: true
        })
        this.setState({
            buyBtn: false
        })
    }

    handleCompleteBtn = (e) =>{
        
    }

    handleSearch = (e) =>{
        
    }


    render() {      

        if(!this.state.user) {
            return (
              <h1>Loading...</h1>
            );
        }

        return (
            <div>
                    <Header currentPage={`Trading`} userName={this.state.user.username}/> 
                    <Container maxWidth='sm'>
                    <div id="trade-container">
                        <br />
                        <div id="account-container" type="text">{this.state.user.account.accountName}</div>
                        <br/>

                       
                        <div id="fundsAvialable">
                            <span style={{width: "80%"}}>Cash Balance: </span> 
                            <span id="cash">{"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}</span>
                            </div> 
                       

                        <form id="search-container">
                            <TextField id="search-input" label="Enter a name or symbol" variant="outlined" />    

                            <Button id="searchBtn" onClick={this.handleSearch}><i class='fa fa-search'></i></Button>

                            <details>
                                <summary id="searchResult">Search Result</summary>
                                <ul id="stock-result-list">
                                <div id="stockFound"></div>
                                </ul>
                            </details>
                        </form>

                        <form id="action">
                            <TextField id="trading-quantity-input" label="quantity" variant="outlined" />     
                        
                            <Button id="buyBtn" style={this.state.buyBtn ? {background: "#2ed47a"}:{background: "aliceblue"}} onClick={this.handleBuyBtn}>Buy</Button>
                            <Button id="sellBtn" style={this.state.sellBtn ? {background: "indianred"}:{background: "aliceblue"}} onClick={this.handleSellBtn}>sell</Button>
                        </form>

                        <Button id="CompleteTransactionBtn" onClick={this.handleCompleteBtn} >Complete Transaction</Button>

                    </div>
                    
                    </Container>






        </div>


        );
    }
  }

  export default Trading;
