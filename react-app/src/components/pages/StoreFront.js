import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NavigationIcon from '@material-ui/icons/Navigation';
import { withStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import { Container } from '@material-ui/core';
import Particles from 'react-particles-js';

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
const background = (
  <Particles style={{zIndex: '0', position: 'absolute'}}
    params={{
      "particles": {
          "number": {
              "value": 50
          },
          "size": {
              "value": 4
          },
          "color": {
            "value": "#6c9ff8",            
          }
      },
      "interactivity": {
          "events": {
              "onhover": {
                  "enable": true,
                  "mode": "repulse"
              }
          }
      },
      "line_linked": {
        "color": "#202023"
      }
  }} />
);

class StoreFront extends React.Component {

    handleLogin = () =>{   
      
      this.props.history.push('/login');
      window.location.reload(false);
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
                {background}
                <Container maxWidth="sm">
              
                    <h1 className={classes.font}>UCLEI</h1>          
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
