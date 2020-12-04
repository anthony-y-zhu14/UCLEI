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
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import formatISO from 'date-fns/formatISO'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

function createData(date, quote) {
  return { date, quote };
}

export default function BasicTable({stockData}) {
  const classes = useStyles();
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2020-12-01T21:11:54'));
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date('2020-12-01T21:11:54'));

  const handleDateChange = (date) => {   
    setSelectedStartDate(date);
  };

  const handleDateChange2 = (date) => {   
    setSelectedEndDate(date);
  };

  const handleFilter = () => {
    console.log(stockData)
  };

  let data = [];

  for(let entry of Object.entries(stockData.historical)) {
    data.push(entry);
  }

  let rows =
    data.map(stock => (
      createData(`${stock[0]}`, `$${stock[1]}`)
    ));

  return (
    <TableContainer style={{backgroundColor: "#222024", color:"#fff", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}component={Paper}>
    <h3 className={classes.font}>Historical Data: {stockData.symbol}</h3>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <Grid className={classes.back} container spacing={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={4} style={{marginLeft: "5%"}}>
                <KeyboardDatePicker
                  margin="normal"
                  value={selectedStartDate}
                  onChange={handleDateChange}
                  label="Start Date"
                  format="yyyy/MM/dd"
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}            
                />
            </Grid>
            <Grid item xs={4}>
            <KeyboardDatePicker
                  margin="normal"           
                  label="End Date"
                  value={selectedEndDate}
                  onChange={handleDateChange2}
                  format="yyyy/MM/dd"
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}            
                />    
            </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={2} style={{marginTop: '2.5%'}}>
              <Button variant="contained" onClick={handleFilter}>Submit</Button> 
            </Grid>
          </Grid>
          <TableRow >
            <TableCell className={classes.font}>Date</TableCell>
            <TableCell className={classes.font} align="right">Quote ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className={classes.font} component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell className={classes.font} align="right">{row.quote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
