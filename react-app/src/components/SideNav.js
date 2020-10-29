import React from "react";
import "./css/SideNav.css";
import {withRouter} from 'react-router-dom';

let links = {
  act: '/account',
  dsh: '/dashboard',
  trd: '/trading',
  mrk: '/market'
};

class Sidenav extends React.Component {

  navToAct = (value) => {
    this.props.history.push(links.act);
  }

  navToDsh = (value) => {
    this.props.history.push(links.dsh);
  }

  navToTrd = (value) => {
    this.props.history.push(links.trd);
  }

  navToMrk = (value) => {
    this.props.history.push(links.mrk);
  }

    render() {
    return(

            <div id="sidenav">
                <h3 id="sidenav-title">UCLEI</h3>
                <ul id="sidenav-list">
                <li onClick={this.navToDsh}>
                    <i className='fa fa-dashboard'></i>
                    Dashboard</li>
                <li onClick={this.navToAct}>
                    <i className="fa fa-credit-card" aria-hidden="true"></i>
                    Account
                    </li>
                <li onClick={this.navToTrd}>
                    <i className="fa fa-exchange" aria-hidden="true"></i>
                    Trading</li>
                <li onClick={this.navToMrk}>
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                    Market
                </li>
                </ul>
                <div id="add-funds">
                <a id="add-funds-link">
                    <i className='fa fa-plus-circle'></i>
                    Add Funds</a>
                </div>
            </div>
        );
    }

}


export default (withRouter)(Sidenav);
