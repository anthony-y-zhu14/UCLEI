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
                    <React.Fragment>
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
                            <TextField label="Quantity" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setQuantity} value={this.state.quantity}/>
                            <TextField label="Limit Price" type='number' variant="outlined" InputProps={{className: classes.input}} onChange={this.setLimitPrice} value={this.state.limit_price}/>
                            <ButtonGroup disableElevation variant="outlined"  id="option-group" className={classes.button}>
                                <Button  style={this.state.orderBuy ? {background: "#2ed47a"}:{background: "aliceblue"}} onClick={this.handleBuyBtn}>Buy</Button>
                                <Button  style={this.state.orderSell ? {background: "indianred"}:{background: "aliceblue"}} onClick={this.handleSellBtn}>Sell</Button>
                            </ButtonGroup>
                            <br/>
                            <br/>
                            <Button id="CompleteTransactionBtn" onClick={this.handleCompleteBtn}>Complete Transaction</Button>
                    </React.Fragment>
                    )}
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
