import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "./components/Header.js"
import Login from "./components/pages/Login.js"
import Dashboard from "./components/pages/Dashboard.js"
import SearchAppBar from './components/Header.js';
import Account from "./components/pages/Account.js"

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path= "/" render={props => (
            <React.Fragment>
              <div className="main">
                <SearchAppBar />               
              </div>
            </React.Fragment>
          )} />


          <Route path="/login" component={Login} />

          <Route path="/dashboard" component={Dashboard} />

          <Route path="/account" component={Account} />

        </div>
      </Router>
    );
  }
};

export default App;
