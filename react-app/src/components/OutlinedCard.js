import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  let history = useHistory();

  const handleClick = (event) => {
      let location = {
        pathname: `/market/${stock.symbol}`,
        state: {
          query: stock.symbol
        }
      }
      history.push(location);
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
            Total Cost: ${stock.total_cost}
          </Typography>
          <Typography variant="body2" component="p">
            Average Cost: ${stock.average_cost}
          </Typography>
          <Typography variant="body2" component="p">
            Amount of Shares: {stock.share}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleClick}>View Detail</Button>
        </CardActions>
      </Card>
  );
  }
