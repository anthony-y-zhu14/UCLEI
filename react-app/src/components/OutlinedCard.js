import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 50,
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

export default function OutlinedCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          ACB
        </Typography>
        <Typography variant="h5" component="h2">
          Auroria Cannabis Inc.
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Market (Nasdaq / NYSE)
        </Typography>
        <Typography variant="body2" component="p">
          PRICE / PERCENT GROWTH
          <br />
          
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">View Stock</Button>
      </CardActions>
    </Card>
  );
}