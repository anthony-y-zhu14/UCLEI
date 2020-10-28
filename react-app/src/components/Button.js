import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  selected: {
    '& > *': {
      margin: theme.spacing(1),
    },
    color: 'primary'
  },
  unselected: {
    '& > *': {
        margin: theme.spacing(1),
      },
      color: 'default'
  }
}));

const ContainedButtons = ({text, toggle}) => {

    const classes = useStyles();

    return (
        <div className={classes.toggle}>
          <Button variant="contained">{text}</Button>        
        </div>
      );
  }


export default withStyles(useStyles)(ContainedButtons);
