import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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

function createData( name, symbol, quote, prev_close, volume, percentage ) {
  return { name, symbol, quote, prev_close, volume, percentage };
}

function getDate() {
  let date = new Date();
  let today = date.toISOString().slice(0,10);
  return today;
}

export default function MarketTable({stockData}) {
  const classes = useStyles();
  const [sort, setSort] = React.useState('');
  const [rows, setRows] = React.useState([]);

  // const handleChange = (event) => {
  //   setSort(event.target.value)
  // };

  let data = [];
  let rowsD = [];

  const createRows = () => {
    for(let i = 0; i < data.length; i++) {
      rowsD.push(createData(data[i][1].name, data[i][1].symbol, data[i][1].quote, data[i][1].prev_close, data[i][1].volume, data[i][1].percentage));
      if(rows.length === 0) { setRows(rowsD); }
    }
  }

  useEffect(() => {
    console.log(sort)
    if(rows.length === 0) {
      createRows();
    }
    if(sort === 2) {
      setRows(rows.sort().reverse())
    }
    else if(sort === 0 || sort === 1) {
      setRows(rows.sort());
    }
  }, [sort, rows]);

  function sortByNameDes() {
    setRows(rows.sort().reverse())
  }

  function sortByNameAs() {
    setRows(rows.sort());
  }

  for(let entry of Object.entries(stockData)) {
    data.push(entry);
  }

  if(rowsD) {
    return (
      <TableContainer style={{backgroundColor: "#35363C", color:"#fff", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '600px'}}component={Paper}>
      <Container>
        <h3 className={classes.font}>Market (D35-C) on: {getDate()} {stockData.symbol}</h3>
        <FormControl variant="outlined" style={{float: 'right', marginTop: "-5%"}}className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" style={{marginTop:"-1%"}}>Sort</InputLabel>
          <Select style={{color: "#fff"}}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={sort}
            onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>By Name: (A-Z)</MenuItem>
            <MenuItem value={2}>By Name: (Z-A)</MenuItem>
            <MenuItem value={3}>By Quote (Low - High)</MenuItem>
            <MenuItem value={4}>By Quote (High - Low)</MenuItem>
          </Select>
        </FormControl>
      </Container>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow >
              <TableCell className={classes.font}>Name</TableCell>
              <TableCell className={classes.font}>Symbol</TableCell>
              <TableCell className={classes.font}>Quote</TableCell>
              <TableCell className={classes.font}>Previous Close</TableCell>
              <TableCell className={classes.font}>Volume</TableCell>
              <TableCell className={classes.font} align="right">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.name}>
                <TableCell className={classes.font} component="th" scope="row">{row.name}</TableCell>
                <TableCell className={classes.font} component="th" scope="row">{row.symbol}</TableCell>
                <TableCell className={classes.font} component="th" scope="row">${row.quote}</TableCell>
                <TableCell className={classes.font} component="th" scope="row">${row.prev_close}</TableCell>
                <TableCell className={classes.font} component="th" scope="row">{row.volume}</TableCell>
                <TableCell className={classes.font} align="right">{row.percentage}%</TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <h1> LOADING </h1>
    )
  }

}
