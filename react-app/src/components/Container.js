import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    color: "#fff",
    backgroundColor: '#393b41',
    height: '100vh',
    width: '48%',
    border: '1px solid #000',
    borderRadius: '10px'
  }
};

class SimpleContainer extends React.Component {

  render() {

    const { classes } = this.props;

    return (
        <Container className={classes.root} maxWidth="false">
        <Typography variant="h1" component="h2">
        {this.state}
        </Typography>
        </Container>
      );
  }

};

export default withStyles(styles)(SimpleContainer);
