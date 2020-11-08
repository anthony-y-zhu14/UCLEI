import React from "react";
import "./css/SideNav.css";
import {withRouter} from 'react-router-dom';
import Modal from '@material-ui/core/Modal';


let links = {
  act: '/account',
  dsh: '/dashboard',
  trd: '/trading',
  mrk: '/market'
};

class Sidenav extends React.Component {
  constructor() {
      super();
      this.state = {
          display: false
      };
  }

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

  handleOpen = () => {
    this.setState( {display: true} );
  };

  handleClose = () => {
    this.setState( {display: false} );
  };

    render() {
    return(
            <div id="sidenav">
                <h3 id="sidenav-title">UCLEI</h3>
                <ul id="sidenav-list">
                <li className='snli' onClick={this.navToDsh}>
                    <i className='fa fa-dashboard'></i>
                    Dashboard</li>
                <li className='snli' onClick={this.navToAct}>
                    <i className="fa fa-credit-card" aria-hidden="true"></i>
                    Account
                    </li>
                <li className='snli' onClick={this.navToTrd}>
                    <i className="fa fa-exchange" aria-hidden="true"></i>
                    Trading</li>
                <li className='snli' onClick={this.navToMrk}>
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                    Market
                </li>
                </ul>
                <div id="add-funds">
                <a id="add-funds-link" onClick={this.handleOpen}>
                    <i className='fa fa-plus-circle'></i>
                    Add Funds</a>

                    <Modal
                  open={this.state.display}
                  onClose={this.handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"></Modal>
                </div>

            </div>

        );
    }

}

export default (withRouter)(Sidenav);
