import React from 'react';
import Button from '@material-ui/core/Button';
import  { Breakpoint} from 'react-socks';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose'
import returnStyles from '../css/loginStyle.js'
import Grid from '@material-ui/core/Grid';
import Particles from 'react-particles-js';
const styles = returnStyles;

class Login extends React.Component {
  _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            helperText: '',
            helperTextPsw: '',
            id: 'outlined-basic',
            authenticated: '',
            errorPsw: false,
            errorUsr: false
        };
        this.login = this.login.bind(this);
    }
    componentWillUnmount() {
      this.setState = ()=>{
        return;
      };
    }
    componentDidMount() {
      if (this.props.session_id){
        this.navToDsh();
      }      
    }

    login = async () => {
      this._isMounted = true;
      if (!this.state.username || !this.state.password){
        alert("Please enter a username and password");
        return;
      }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.state.username, password: this.state.password })
        };
        const response = await fetch('/authentication', requestOptions);
        const data = await response.json();
        this.setState({ authenticated: data.authentication});

        if(this.state.authenticated === 'passwordError') {
          this.setState({ errorUsr: false, helperText: ''})
          this.setState({ errorPsw: true, helperTextPsw: 'Invalid Password'})
        }
        else if(this.state.authenticated === 'usernameError') {
          this.setState({ errorUsr: true, helperText: 'Invalid Username'})
          this.setState({ errorPsw: true, helperTextPsw: 'Invalid Password'})
        }
        else if(this.state.authenticated === 'true') {
          this.props.onChange(data.session_id);
          this.navToDsh();
        }
    }
    register = () =>{
      this.props.history.push('/register');
    }
    navToDsh = () => {
      this.props.history.push('/dashboard');
    }
    setUsername = event => {
        this.setState ({
            username: event.target.value
        });
    }
    setPassword = event => {
        this.setState ({
            password: event.target.value
        });
    }

    content = (size, classSize) => {
      const { classes } = this.props;    
 
      const formContent = (
        <Grid container>
          <Grid item xs={12}>
                <h1> UCLEI </h1>
                <h3>Welcome,</h3>
                <p>We're happy to see you back.</p>

            <TextField id={this.state.id} label="Username" error={this.state.errorUsr}
            InputProps={{classes: {
              input: classSize,
              },
            }} helperText={this.state.helperText}
            InputLabelProps={{style:{fontSize:size}}}
            variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
          </Grid>
          <Grid item xs={12}>
            <TextField helperText={this.state.helperTextPsw} error={this.state.errorPsw}
            label="Password" variant="outlined" type="password"
            InputProps={{classes: {
              input: classSize,
              },
            }}
            InputLabelProps={{style:{fontSize:size}}}
            onChange = {this.setPassword} value = {this.state.password} />
          </Grid>
          <Grid item xs={12}>
            <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
            <Button className={classes.rgsBtn} variant="contained" color="primary" onClick={this.register}>Register</Button> 
          </Grid>
        </Grid>
      );

      return formContent;
    }
      

    render() {
      const { classes } = this.props;    

      const background = (
        <Particles style={{zIndex: '0', position: 'absolute'}}
          params={{
            "particles": {
                "number": {
                    "value": 20
                },
                "size": {
                    "value": 4
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    }
                }
          }
        }} />
      );

      return (
        <React.Fragment>
          <Breakpoint large up>
            <React.Fragment>
              <form className={classes.LloginContainer}>
              <div  className={classes.wrapper} style={{margin: 40}}>
              {background}
                      {this.content(28, classes.Linput)}
                  </div>
              </form>
            </React.Fragment>
          </Breakpoint>

          <Breakpoint medium down>
          <React.Fragment>
            <form className={classes.loginContainer}>
            <div className={classes.wrapper} style={{margin: '6%'}}>
            {background}
                    {this.content(16, classes.input)}
                </div>
            </form>
          </React.Fragment>
          </Breakpoint>

        </React.Fragment>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Login))
