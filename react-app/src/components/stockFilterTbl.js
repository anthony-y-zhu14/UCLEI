import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '@date-io/date-fns'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  font: {
    color: '#fff',
    margin: 15,
  },
  back: {
    background: '#fff',
    marginLeft: '2%',
    borderRadius: 10
  },
  textField: {
    color: '#fff',
    width: 200,
  },
});

function createData(date, quote, volume, ) {
  return { date, quote, volume };
}

export default function FilteredTable({stockData}) {
  const classes = useStyles();



let rows = stockData.map((X) =>  (
    createData(X.date, X.closingPrice, X.volume)
))

  return (
    <TableContainer style={{backgroundColor: "#222024", color:"#fff", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}component={Paper}>
    <h3 className={classes.font}>Historical Data (filtered):</h3>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell className={classes.font}>Date</TableCell>
            <TableCell className={classes.font} align="right">Volume</TableCell>
            <TableCell className={classes.font} align="right">Closing Price ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className={classes.font} component="th" scope="row">{row.date}</TableCell>
              <TableCell className={classes.font} align="right">{row.volume}</TableCell>
              <TableCell className={classes.font} align="right">{row.quote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
