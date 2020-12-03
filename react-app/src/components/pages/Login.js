import React from 'react';
import Button from '@material-ui/core/Button';
import  { Breakpoint, BreakpointProvider } from 'react-socks';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import UncontrolledLottie from "../UncontrolledLottie";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose'
import returnStyles from '../css/loginStyle.js'
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
            authenticated: 'onload',
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
      fetch('/session')
            .then((res) => res.json())
            .finally(() =>{
              if (this.state.authenticated === 'true'){
                this.navToDsh();
              }
            })
            .catch((error) => console.log(error.message));
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
        console.log(data.authentication)
        this.props.onChange(data.session_id);

        if(this.state.authenticated === 'onload') {
          this.setState({ id: 'outlined-basic', helperText: '', error: false})
        }
        if(this.state.authenticated === 'passwordError') {
          this.setState({ errorUsr: false, helperText: ''})
          this.setState({ errorPsw: true, helperTextPsw: 'Invalid Password'})
        }
        if(this.state.authenticated === 'usernameError') {
          this.setState({ errorUsr: true, helperText: 'Invalid Username'})
          this.setState({ errorPsw: true, helperTextPsw: 'Invalid Password'})
        }
        if(this.state.authenticated === 'true') {
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

    render() {
      const { classes } = this.props;
      return (
        <React.Fragment>
        <Breakpoint customQuery="(min-width: 2201px) and (max-width: 16000px)">
          <form className={classes.LloginContainer}>
          <div className={classes.LWrapper}>
            <div>
              <h1 className={classes.xlTitle}> UCLEI </h1>
              <h3 className={classes.lTitle}>Welcome,</h3>
              <p className={classes.lFont}>We're happy to see you back.</p>
                  <div className={classes.innerContainer}>
                  <div className={classes.LtxtFldCont}>
                    <TextField id={this.state.id} className={classes.LtxtFld} label="Username" error={this.state.errorUsr}
                    InputProps={{classes: {
                      input: classes.Linput,
                      },
                    }} helperText={this.state.helperText}
                    InputLabelProps={{style:{fontSize:40}}}

                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.LtxtFld} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                    label="Password" variant="outlined" type="password"
                    InputProps={{classes: {
                      input: classes.Linput,
                      },
                    }}
                    InputLabelProps={{style:{fontSize:40}}}
                    onChange = {this.setPassword} value = {this.state.password} />
                  </div>
                  <div className={classes.lottieCont}>
                    <UncontrolledLottie />
                  </div>
                  <div className={classes.LbuttonContainer}>
                    <Button className={classes.lBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
                    <Button className={classes.lBtn} variant="contained" color="primary" onClick={this.register}>Register</Button>
                  </div>
                  </div>
                </div>

              </div>
          </form>
        </Breakpoint>

        <Breakpoint customQuery="(min-width: 901px) and (max-width: 2200px)">
          <form className={classes.loginContainer}>
          <div className={classes.sWrapper}>
            <div>
              <h1> UCLEI </h1>
              <h3>Welcome,</h3>
              <p>We're happy to see you back.</p>
                  <div className={classes.innerContainer}>
                  <div className={classes.txtFldCont}>
                    <TextField id={this.state.id} className={classes.txtFld} label="Username" error={this.state.errorUsr}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.txtFld} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                    label="Password" variant="outlined" type="password" id={this.state.id}
                    InputProps={{className: classes.input}}
                    onChange = {this.setPassword} value = {this.state.password} />
                  </div>
                  <div className={classes.lottieCont}>
                  <UncontrolledLottie />
                  </div>
                  </div>
                </div>
                <div className={classes.sbuttonContainer}>
                  <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
                  <Button className={classes.rgsBtn} variant="contained" color="primary" onClick={this.register}>Register</Button>
                </div>
              </div>
          </form>
        </Breakpoint>

        <Breakpoint customQuery="(min-width: 600px) and (max-width: 900px)">
          <form className={classes.loginContainer}>
          <div className={classes.sWrapper}>
            <div>
              <h1> UCLEI </h1>
              <h3>Welcome,</h3>
              <p>We're happy to see you back.</p>
                  <div className={classes.innerContainer}>
                  <div className={classes.txtFldCont}>
                    <TextField id={this.state.id} className={classes.txtFld} label="Username" error={this.state.errorUsr}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.txtFld} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                    label="Password" variant="outlined" type="password" id={this.state.id}
                    InputProps={{className: classes.input}}
                    onChange = {this.setPassword} value = {this.state.password} />
                  </div>
                  <div className={classes.lottieCont}>
                  </div>
                  </div>
                </div>
                <div className={classes.sbuttonContainer}>
                  <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
                  <Button className={classes.rgsBtn} variant="contained" color="primary" onClick={this.register}>Register</Button>
                </div>
              </div>
          </form>
        </Breakpoint>
        <Breakpoint customQuery="(min-width: 0) and (max-width: 599px)">
          <form className={classes.loginContainer}>
          <div className={classes.xsWrapper}>
            <div>
              <h1> UCLEI </h1>
              <h3>Welcome,</h3>
              <p>We're happy to see you back.</p>
                  <div className={classes.innerContainer}>
                  <div className={classes.xstxtFldCont}>
                    <TextField id={this.state.id} className={classes.xstxtFld} label="Username" error={this.state.errorUsr}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.xstxtFld} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                    label="Password" variant="outlined" type="password" id={this.state.id}
                    InputProps={{className: classes.input}}
                    onChange = {this.setPassword} value = {this.state.password} />
                  </div>
                  <div className={classes.lottieCont}>
                  </div>
                  </div>
                </div>
                <div className={classes.xsbuttonContainer}>
                  <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
                  <Button className={classes.rgsBtn} variant="contained" color="primary" onClick={this.register}>Register</Button>
                </div>
              </div>
          </form>
        </Breakpoint>
        </React.Fragment>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Login))
