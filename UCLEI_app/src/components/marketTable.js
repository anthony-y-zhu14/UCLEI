import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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

  let data = [];
  let rowsD = [];

  const createRows = () => {
    for(let entry of Object.entries(stockData)) {
      data.push(entry);
    }
    for(let i = 0; i < data.length; i++) {
      rowsD.push(createData(data[i][1].name, data[i][1].symbol, data[i][1].quote, data[i][1].prev_close, data[i][1].volume, data[i][1].percentage));
      setRows(rowsD);
    }
  }

  useEffect(() => {
    createRows();

    if(sort === 2) {
      setRows(rowsD.sort().reverse())
    }
    if(sort === 1) {
      setRows(rowsD.sort());
    }
    if(sort === 3) {
      setRows(rowsD.sort((a, b) => {
        return a.quote - b.quote;
      }));
    }
    if(sort === 4) {
      setRows(rowsD.sort((a, b) => {
        return b.quote - a.quote;
      }));
    }
    if(sort === 5) {
      setRows(rowsD.sort((a, b) => {
        return a.volume - b.volume;
      }));
    }
    if(sort === 6) {
      setRows(rowsD.sort((a, b) => {
        return b.volume - a.volume;
      }));
    }
  }, [sort]);

  const table = (
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
  )

  if(rows) {
    return (
      <TableContainer style={{backgroundColor: "#202023", color:"#fff", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', height: '600px'}}component={Paper}>
      <Container>
        <h3 className={classes.font}>Market (D35-C) on: {getDate()} {stockData.symbol}</h3>
        <FormControl variant="outlined" style={{float: 'right', marginTop: "-5%"}}className={classes.formControl}>
          <InputLabel id="demo-simple-select-filled-label" style={{marginTop:"-1%"}}>Sort</InputLabel>
          <Select style={{color: "#fff"}}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>By Symbol: (A-Z)</MenuItem>
            <MenuItem value={2}>By Symbol: (Z-A)</MenuItem>
            <MenuItem value={3}>By Quote (Low - High)</MenuItem>
            <MenuItem value={4}>By Quote (High - Low)</MenuItem>
            <MenuItem value={5}>By Volume (Low - High)</MenuItem>
            <MenuItem value={6}>By Volume (High - Low)</MenuItem>
          </Select>
        </FormControl>
        {table}
      </Container>
      </TableContainer>
    );
  } else {
    return (
      <h1> LOADING </h1>
    )
  }

}
