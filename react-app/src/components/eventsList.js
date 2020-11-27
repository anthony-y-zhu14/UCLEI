import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    backgroundColor: "#393B41",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
  },
  font: {
      color: "#fff"
  },
  cont: {
      display: 'flex',
      flexWrap: 'wrap'
  },
  det: {
      width: '35%'
  },
  fieldO: {
    paddingLeft: 30,
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  but: {
      width: '10%',
  },
  sub: {
      paddingLeft: 30,
      color: '#6c9ff8'
  },
  field: {
      width: '50%'
  },
  input: {
    color: "#fff"
  },
}));


const EventsList = ({stockData}) => {
  const classes = useStyles();
  const [num, setNum] = React.useState(false);

  const setTheNum = (event) => {
    setNum(event.target.value)
}

const handleEventUpdate = async (id) => {
  let data = {
    num: num,
    value: id
  }
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  };
  await fetch('/updateEventNum', requestOptions);
}

  const removeEvent = async (id) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: id })
  };
    await fetch('/rmvEventNotify', requestOptions);
  };

  const setActive = async (id) => {
    console.log(id);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: id })
  };
    await fetch('/reactivateEvent', requestOptions);
  };

  return (
    <div className={classes.root}>

    <React.Fragment>
        {stockData.map(stock => (
                  <Accordion className={classes.heading}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                  >
                    <Typography className={classes.heading}>{stock.name}, ({stock.symbol}):</Typography>
                    <Typography className={classes.sub}>{stock.message}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.cont}>
                    <Typography className={classes.det}>
                        You have requested to be notified when {stock.symbol} changes by: {stock.notify_num}%.
                    </Typography>

                    <Typography className={classes.fieldO}>
                        Change notification?
                    <TextField
                            className={classes.field}
                            autoFocus
                            margin="dense"
                            variant="outlined"
                            id="name"
                            label="Percentage"
                            type="Percentage"
                            onChange = {setTheNum}
                            InputProps={{className: classes.input}}
                        />
                    </Typography>
                    <Typography className={classes.but} onClick={() => handleEventUpdate(stock.symbol)}>
                    <Button color="primary">
                      Update
                    </Button>
                    </Typography>
                    <Typography className={classes.but} onClick={() => setActive(stock.symbol)}>
                    <Button color="primary">
                        {stock.active}
                    </Button>
                    </Typography>
                    <Typography>
                    <IconButton className={classes.but} onClick={() => removeEvent(stock.symbol)}>
                        <DeleteIcon color="primary"/>
                    </IconButton>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
        ))}
    </React.Fragment>

    </div>
  );
}

export default EventsList;
