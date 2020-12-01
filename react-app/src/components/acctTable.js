import React, { useState, useEffect } from 'react';
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
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Button, ButtonGroup, Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SortIcon from '@material-ui/icons/Sort';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
// import { date } from 'date-fns/locale/af';


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


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

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
                        {historyRow.action}
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
}

export default function AccountTable({userData}) {
  const classes = useStyles();
  const [filter, setFilter] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2020-12-01T21:11:54'));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date('2020-12-01T21:11:54'));

  const filterByDate = (date1, date2) => {
    let newData = (userData.activity.filter((activity) => {
      return (activity.date >= formatISO(date1, { representation: 'date' } ) && activity.date <= formatISO(date2, { representation: 'date' } ));
    }));
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
    let data = [];   
      
    userData.activity.map(activity =>(     
    data.push(activity)
    ))

    if(rows.length === 0) {
      setRows(data);
    }
  }

  useEffect(() => {
    if(!loaded){
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

        <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="No results found for given range."
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        />
          
         </MuiPickersUtilsProvider>
         <Button onClick={() => filterByDate(selectedStartDate, selectedEndDate)}>Confirm</Button>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.date} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
      
  }
