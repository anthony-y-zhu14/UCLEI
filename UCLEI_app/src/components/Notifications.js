import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventsList from './eventsList.js';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: "#202023",
    },
    back: {
        backgroundColor: '#202023',
        color: '#fff',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      color: "#fff",
      backgroundColor: '#202023',
      fontWeight: theme.typography.fontWeightRegular,
    },
    font: {
        color: "#fff"
    },
    text: {
        backgroundColor: '#202023',
        color: '#fff',
        padding: '5%',
    }
  }));

export default function NotificationsForm({stockData, notifynums}) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div >
          <Badge onClick={handleClickOpen} badgeContent={notifynums} color="secondary" >
            <NotificationsIcon/>
          </Badge>
      <Dialog  maxWidth={"lg"}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.heading}>
            Notifications
        </DialogTitle>
        <DialogContent className={classes.back}>
        <Tooltip title="This list will appear empty if you have yet to subscribe to a stock.
            To subscribe to a stock navigate to the market page or simply search for a stock.
            Then, select 'set notification'. The notifications will be waiting here :) ."><InfoIcon /></Tooltip>
          <DialogContentText className={classes.back}>
              <EventsList stockData={stockData}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.back}>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
