import React, { useEffect, useRef, forwardRef, useImperativeHandle, } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '@date-io/date-fns'
import DateFnsUtils from '@date-io/date-fns';
import formatISO from 'date-fns/formatISO'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,

  },
  table: {
    minWidth: 650,
    overflowY: 'auto',
  },
  font: {
    color: '#fff',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const Row = forwardRef((props, ref) => {
  const { row } = props;
  const { open2 } = props;
  const [open, setOpen] = React.useState(open2);
  const classes = useStyles();

  const hideRows = () => {
    setOpen(false);
  }

  useImperativeHandle(ref, () => {
    return {
      hideRows : hideRows
    };
  });

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
      <TableCell  align="left" component="th" scope="row">
        {row.date}
      </TableCell>
      <TableCell align="right">
        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Activity Type:</TableCell>
                    <TableCell>Message:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.activities.map((historyRow) => (
                    <TableRow key={historyRow.action}>
                      <TableCell component="th" scope="row">
                        {historyRow.action.toUpperCase()}
                      </TableCell>
                      <TableCell>{historyRow.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
});

export default function AccountTable({userData}) {
  const ref = useRef(null);
  const [type, setType] = React.useState('All');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2020-12-01T21:11:54'));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date('2020-12-01T21:11:54'));

  const filterByDate = () => {   
    
    if(ref.current !== null) {
      ref.current.hideRows();
    }
    let newData = (JSON.parse(JSON.stringify(userData.activity)).filter((activity) => {  
      return (activity.date >= formatISO(selectedStartDate, { representation: 'date' } ) && activity.date <= formatISO(selectedEndDate, { representation: 'date' } ));         
    }));    
    newData.forEach((date) => {
      if(type === 'All'){
        return;
      }      
      else{
        date.activities = date.activities.filter((activity) => {        
          return (activity.action.toUpperCase() === type.toUpperCase());
        });        
      }
    });
    newData = newData.filter((date) =>{
      return (date.activities.length > 0);
    }) 

    console.log(newData);
    
    if(newData.length === 0) {
      setOpen(true)
      setLoaded(true)
    }
    setRows(newData);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDateChange = (date) => {   
    setSelectedStartDate(date);
  };

  const handleDateChange2 = (date) => {   
    setSelectedEndDate(date);
  };

  const createRows = () => {      

    if(rows.length === 0) {
      setRows(userData.activity);
    }
  }

  useEffect(() => {
    if(!loaded || !open){
      createRows();
    }   
  });
  
    return (
      <TableContainer component={Paper}>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              label="Start Date"
              format="yyyy/MM/dd"
              value={selectedStartDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}            
            />
            <KeyboardDatePicker
              margin="normal"           
              label="End Date"
              format="yyyy/MM/dd"
              value={selectedEndDate}
              onChange={handleDateChange2}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}            
            />

            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} open={open} autoHideDuration={6000} onClose={handleClose} message="No results found for given range." action={
            <React.Fragment>
                <Button color="secondary" size="small" onClick={handleClose}>UNDO</Button>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
            />          
         </MuiPickersUtilsProvider>
         <br/>         
          <Select labelId="demo-simple-select-filled-label" value={type} onChange={(e)=>{
            setType(e.target.value)}}>
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Sell"}>Sell</MenuItem>
            <MenuItem value={"Buy"}>Buy</MenuItem>
            <MenuItem value={"Withdraw"}>Withdraw</MenuItem>
            <MenuItem value={"Deposit"}>Deposit</MenuItem>           
          </Select>

        <Button onClick={() => {
        filterByDate();
        setIsOpen(false);
        }}>
          Confirm</Button>
        
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Date</TableCell>
            </TableRow>
          </TableHead>          
          <TableBody>
            {rows.map((row) => (
              <Row key={row.date} open2={isOpen} ref={ref} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
      
  }
