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
                </div>

                <Modal
                open={this.state.display}
                onClose={this.handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description">
                  <div>
                  <div id="add-funds-modal" >
                      <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3 id="modal-title">Add funds</h3>
                    <form>
                      <div id="modal-account-balance">
                        <span class="modal-text">Account Balance:</span>
                        <span class="modal-text" class="cashBalance" id="money">2020.28</span>
                      </div>

                      <p id="text-labels" class="text">Input Dollar Amount</p>
                      <input name="money" value="" type="text" id="money-form" class="text-field-email"></input>
                      <div id="modal-container">
                        <div id="buttons-modal">
                          <div id="money-deposit" class="funds">Deposit</div>
                          <div id="money-withdraw" class="funds">Withdrawl</div>
                        </div>
                        <div id="info-box">
                          <div class="info-box">
                            <div class="info-title">Add and Remove Funds</div>
                            <div id="info-text">Type the amount of cash you would
                              like to add or remove in the box to
                              the left and select to deposit or withdrawl
                              funds from your account.</div>
                          </div>
                        </div>
                    </div>
                    </form>
                  </div>
                  </div>
                  </div>
                </Modal>
            </div>

        );
    }

}


export default (withRouter)(Sidenav);
