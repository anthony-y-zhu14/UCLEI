import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({name}) {
  const [open, setOpen] = React.useState(false);
  const [num, setNum] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const setTheNum = (event) => {
      setNum(event.target.value)
  }

  const handleEventSave = async () => {
    let data = {
      num: num,
      name: window.location.href.slice(29)
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    await fetch('/addEventNotify', requestOptions);
    handleClose();
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Set Notification
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe an Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To get notifications regarding {name} please enter a number representing the stock decrease
            or increase as a percentage. Ex: If you type 5 then you will be notified if that stock's price
            dips or increases by greater than or equal to 5%. If you type -5, you will be notified if the stock
            dips by -5% or more.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Percentage"
            type="Percentage"
            fullWidth
            onChange = {setTheNum}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEventSave} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
