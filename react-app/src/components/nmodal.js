import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Sidenav from "./sidenav.js";

const useStyles = makeStyles((theme) => ({
 modal: {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
 },
 paper: {
   backgroundColor: theme.palette.background.paper,
   border: '2px solid #000',
   boxShadow: theme.shadows[5],
   padding: theme.spacing(2, 4, 3),
 },
}));

export default function TransitionsModal() {
 const classes = useStyles();
 const [open, setOpen] = React.useState(false);

 const handleOpen = () => {
   setOpen(true);
 };

 const handleClose = () => {
   setOpen(false);
 };

 return (
   <div>
     <button type="button" onClick={handleOpen}>
       react-transition-group
     </button>
     <Modal
       aria-labelledby="transition-modal-title"
       aria-describedby="transition-modal-description"
       className={classes.modal}
       open={open}
       onClose={handleClose}
       closeAfterTransition
       BackdropComponent={Backdrop}
       BackdropProps={{
         timeout: 500,
       }}
     >
       <Fade in={open}>
         <div className={classes.paper}>
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
         </div>
       </Fade>
     </Modal>
   </div>
 );
}
