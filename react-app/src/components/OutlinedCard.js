import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { blueGrey } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles({
  root: {
    minWidth: 5,

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function OutlinedCard({stock}, {h}) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  let history = useHistory();

  const handleClick = (event) => {
      console.log(event.target.value);
      let location = {
        pathname: `/market/${stock.symbol}`,
        state: {
          query: stock.symbol
        }
      }
      history.push(location);
      console.log(window.location)
      console.log(history)
      // if(window.location.href === '/account/') {
      //   window.location.reload(false);
      // }
      // if(window.location.href === `/market/${stock.symbol}`) {
      //   window.location.reload(true);
      // }
  }

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {stock.symbol}
          </Typography>
          <Typography variant="h5" component="h2">
            {stock.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {stock.quote}
          </Typography>
          <Typography variant="body2" component="p">
            ${stock.quote}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleClick}>View Stock</Button>
        </CardActions>
      </Card>
  );
  }
