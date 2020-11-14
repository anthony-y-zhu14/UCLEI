import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "./components/Header.js"
import Login from "./components/pages/Login.js"
import Market from "./components/pages/Market.js"
import Dashboard from "./components/pages/Dashboard.js"
import Account from "./components/pages/Account.js"
import Trading from './components/pages/Trading';

class App extends React.Component {
  state = {
    routePath: 'fromApp',
    session_id: undefined
  };

  handleChange = data => {    
    if(this.state.session_id !== data.session_id) {
      this.setState({session_id : data.session_id})
    }
  } 

  render() {

    //returns new state once loading is complete
    return (


      <Router>
        <React.Fragment>
          <Route exact path= "/" component={Login} onChange={this.handleChange}/>

          <Route path="/login" component={Login} onChange={this.handleChange}/>

          <Route path="/dashboard" component={Dashboard} render={()=> <Dashboard state={this.state}/>}/>

          <Route path="/account" component={Account} />

          <Route path="/trading" component={Trading} />

          <Route path="/market" component={Market} />

        </React.Fragment>
      </Router>
    );
  }
};

export default App;
