import { Button, ButtonGroup, Container } from '@material-ui/core';
import React from 'react';
import Header from "../Header";
import '../css/Trading.css'

class Trading extends React.Component {
    constructor() {
        super();
        this.state = {
            user: undefined,
            buyBtn: false,
            sellBtn: false
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

        if(!this.state.user) {
            return (
              <h1>Loading...</h1>
            );
        }

        return (
            <div>
                    <Header currentPage={`Trading`} usrName={this.state.user.username}/> 
                    <Container maxWidth='sm'>
                    <div id="trade-container">
                        <div id="account-container" type="text">{this.state.user.account.accountName}</div>
                        <details>
                        <summary id="fundsAvialable">Funds Avialable to Trade</summary>
                        <ul id="funds-list">
                            <p id="cash">
                            {"$" + (Math.round( (parseFloat(this.state.user.account.cashBalance) + parseFloat(this.state.user.account.investmentBalance)) * 100) / 100).toFixed(2)}
                            </p>
                        </ul>
                        </details>

                        <form id="search-container">
                        <input name="search-name" placeholder="Enter a name or symbol" value="" type="text" id="search-input"></input>
                        <Button id="searchBtn"><i class='fa fa-search'></i></Button>

                        <details>
                            <summary id="searchResult">Search Result</summary>
                            <ul id="stock-result-list">
                            <div id="stockFound"></div>
                            </ul>
                        </details>
                        </form>

                        <form id="action">
                        <input name="quantity" placeholder="0" value="" type="text" id="trading-quantity-input"></input>
                        <Button id="buyBtn">Buy</Button>
                        <Button id="sellBtn">sell</Button>
                        </form>

                        <Button id="CompleteTransactionBtn">Complete Transaction</Button>

                    </div>
                    
                    </Container>






        </div>


        );
    }
  }

  export default Trading;
