import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
   modal: {
     display: 'none'
   },
   modalShow: {
     display: 'flex'
   }
};

class Modal extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          display: this.props.display
        };
  }

  handleClose = () => {
    this.setState({ display: 'classes.modal' });
  };

    render() {

      const { classes } = this.props;

    return(
        <div id="add-funds-modal" className={this.state.display} >
            <div className="modal-content">
          <span className="close" onClick={this.handleClose}>&times;</span>
          <h3 id="modal-title">Add funds</h3>
          <form>
            <div id="modal-account-balance">
              <span className="modal-text">Account Balance:</span>
              <span className="modal-text" className="cashBalance" id="money">2020.28</span>
            </div>

            <p id="text-labels" className="text">Input Dollar Amount</p>
            <input name="money" value="" type="text" id="money-form" className="text-field-email"></input>
            <div id="modal-container">
              <div id="buttons-modal">
                <div id="money-deposit" className="funds">Deposit</div>
                <div id="money-withdraw" className="funds">Withdrawl</div>
              </div>
              <div id="info-box">
                <div className="info-box">
                  <div className="info-title">Add and Remove Funds</div>
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

        );
    }
}


export default withStyles(styles)(Modal);
