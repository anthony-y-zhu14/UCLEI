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
    
  };





class StoreFront extends React.Component {    

    handleClick = () =>{    
       
        this.props.history.push('/login');  
                
       
        
    }
    
    

    
    render() {
        const { classes } = this.props;

        return(
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>                        
                        <Typography variant="h6" className={classes.title}>
                                Home
                        </Typography>    
                        
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm">
                    <h1>UCLEI</h1>                    
                    <LinearProgress />
                    <Fab variant="extended" onClick={this.handleClick}>
                        <NavigationIcon />
                            Login
                    </Fab>
                </Container>
                

                


            </div>
            )
    }
}

  export default withStyles(styles)(StoreFront);
