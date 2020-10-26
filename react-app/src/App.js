import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
// import Header from "./components/Header.js"
import Sidenav from "./components/SideNav.js"
import Login from "./components/pages/Login.js"


class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path= "/" render={props => (
            <React.Fragment>
              <div className="main">
                <Sidenav />
              </div>
            </React.Fragment>
          )} />
    

          <Route path="/login" component={Login} />
        </div>
      </Router>
    );
  }
};

export default App;
