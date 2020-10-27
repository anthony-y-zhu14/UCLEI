import React from "react";
// import Sidenav from "./sidenav.js";

class Modal extends React.Component {
    state = {
        display: false
    };

    modal   = ()  =>   {
        // Get the modal
    }

    render() {
    return(
        <div id="add-funds-modal" style={addFundsModalStyle} >
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

        );
    }
}

const addFundsModalStyle = {
    display: "none",
    position: "fixed",
    zIndex: "10",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden"
}

export default Modal;
