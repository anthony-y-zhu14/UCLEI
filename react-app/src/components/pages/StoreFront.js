import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';
import { withStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import { Container, LinearProgress } from '@material-ui/core';
import LineChart from '../Linechart';

const styles = {
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    font: {
      color: "#000"
    },
    li: {
      color: "#000",
      textDecoration: 'underline',
      '&:hover':{
        color: '#6C9FF8',
        cursor: 'pointer'
      },
    }

  };

class StoreFront extends React.Component {

    handleLogin = () =>{   

        this.props.history.push('/login');
    }

    render() {
        const { classes } = this.props;

        return(
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                                Welcome
                        </Typography>

                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm">
                    <h1 className={classes.font}>UCLEI</h1>
                    <LinearProgress />
                    <br />
                    <Typography variant="h6" className={classes.title}>
                            UCLEI is a stock trading simulation website that provides a safe, easy-to-use sandbox environment for users to experience how stock market trading works.
                            Simply create an account and you will be welcomed to the website and free to explore the excitement of stock trading without consequence! However, do be careful,
                            press the wrong button, and you could lose everything.
                    </Typography>
                    <br />
                    <Typography variant="p" className={classes.title}>
                    Made by Anthony Y. Zhu and Joseph Malovic
                    </Typography>
                    <br />
                    <br />

                    <Typography variant="p" className={classes.title}>
                    <a className={classes.li} href="https://github.com/anthony-y-zhu14/UCLEI---Stock-Trading-Platform-Sandbox" target="_blank">Check out the repo here</a>
                    </Typography>
                    <br />
                    <br />
                    <Fab variant="extended" onClick={this.handleLogin}>
                        <NavigationIcon />
                            Get Started
                    </Fab>


                </Container>
            </div>
            )
    }
}

  export default withStyles(styles)(StoreFront);
