import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  font: {
    margin: 15,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

function createData(date, quote) {
  return { date, quote };
}



export default function BasicTable({stockData}) {
  const classes = useStyles();

  let data = [];

  for(let entry of Object.entries(stockData.historical)) {
    data.push(entry);
  }

  let rows =
    data.map(stock => (
      createData(`${stock[0]}`, `$${stock[1]}`)
    ));

  return (
    <TableContainer component={Paper}>
    <h3 className={classes.font}>Historical Data: {stockData.symbol}</h3>
      <Table className={classes.table} aria-label="simple table">

        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Quote ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.quote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
