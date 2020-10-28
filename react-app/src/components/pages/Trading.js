import { Container } from '@material-ui/core';
import React from 'react';
import Header from "../Header";

class Trading extends React.Component {


    render() {
      return (
          <div>
                <Header currentPage={`Trading`} usrName={`jerry137`}/> //this is temp
                <Container>
                <div id="trade-container">
                    <div id="account-container" type="text">TFSA Account CAD 25MBJ</div>
                    <details>
                    <summary id="fundsAvialable">Funds Avialable to Trade</summary>
                    <ul id="funds-list">
                        <p id="cash">Cash Balance: $2000.00</p>
                    </ul>
                    </details>

                    <form id="search-container">
                    <input name="search-name" placeholder="Enter a name or symbol" value="" type="text" id="search-input"></input>
                    <span id="searchBtn"><i class='fa fa-search'></i></span>

                    <details>
                        <summary id="searchResult">Search Result</summary>
                        <ul id="stock-result-list">
                        <div id="stockFound"></div>
                        </ul>
                    </details>
                    </form>

                    <form id="action">
                    <input name="quantity" placeholder="0" value="" type="text" id="trading-quantity-input"></input>
                    <span id="buyBtn">Buy</span>
                    <span id="sellBtn">sell</span>
                    </form>

                    <div id="CompleteTransactionBtn">Complete Transaction</div>

                </div>

                <div id="holding-container">
                    <div id="stock-container">
                        <h2>Current Holding</h2>
                        <ul id="stock-list"></ul>
                        </div>
                </div>
                </Container>






    </div>


      );
    }
  }

  export default Trading;
