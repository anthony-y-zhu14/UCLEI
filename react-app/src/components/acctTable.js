import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

function createData( d ) {
  return { d };
}

function getDate() {
  let date = new Date();
  let today = date.toISOString().slice(0,10);
  return today;
}

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
                    <TableRow key={historyRow[0]}>
                      <TableCell component="th" scope="row">
                        {historyRow[0]}
                      </TableCell>
                      <TableCell>{historyRow[1]}</TableCell>
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
  const [sort, setSort] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(true);

  let data = [];

  const createRows = () => {
    let r = {};
    userData.activity.map(activity => (
      r = { date : undefined, activities: []},
      r.date = (activity.date),
      activity.activities.map(lines => (
        r.activities.push([lines.action, lines.message])
      )),
      data.push(r)
    ))

    if(rows.length !== data.length) {
      setRows(data)
    }
  }

  useEffect(() => {
      createRows();
  })

    return (
      <TableContainer component={Paper}>
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
