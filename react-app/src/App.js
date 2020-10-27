import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import "./components/Header.js"
import Login from "./components/pages/Login.js"
import Dashboard from "./components/pages/Dashboard.js"
import SearchAppBar from './components/Header.js';
import Account from "./components/pages/Account.js"
import Trading from './components/pages/Trading';

class App extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
  this.callBackendAPI()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err));
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/getAccount');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    console.log(this.state);

    return (
      <Router>
        <div>
          <Route exact path= "/login" render={props => (
            <React.Fragment>
              <div className="main">
                <SearchAppBar />  
              </div>
            </React.Fragment>
          )} />


          <Route path="/login" component={Login} />

          <Route path="/dashboard" component={Dashboard} />

          <Route path="/account" component={Account} />

          <Route path="/trading" component={Trading} />



        </div>
      </Router>
    );
  }
};

export default App;
