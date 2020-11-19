import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import "../css/Styles.css";
import UncontrolledLottie from "../UncontrolledLottie";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose'

const styles = {
  root: {
    color: "#fff"
  },
  input: {
    color: "#fff"
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '1%',
    width: '100%'
  },
  lottie: {
    width: '20%',
    position: 'relative',
    margin: '5%'
  },
  login: {
    width: '40%',
    marginLeft: '10%'
  },
  lgnBtn: {
    marginLeft: '18%'
  }
};

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
            error: false,
        };
        this.login = this.login.bind(this);
    }

    componentWillUnmount() {
      this.setState = ()=>{
        return;
      };
    }

    login = async () => {
      this._isMounted = true;

        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.state.username, password: this.state.password })
        };
        const response = await fetch('/authentication', requestOptions);
        const data = await response.json();
        this.setState({ authenticated: data.authentication});
        this.props.onChange(data.session_id);

        if(this.state.authenticate === 'onload') {
          this.setState({ id: 'outlined-basic', helperText: '', error: false})
        }
        else if(!this.state.authenticate) {
          this.setState({ id: 'outlined-error-helper-text', helperText: 'Invalid Username', error: true, helperTextPsw: 'Invalid Password'})
        }
        if(this.state.authenticated) {
          this.navToDsh();
        }
    }

    register = () =>{
      this.props.history.push('/register');
    }

    navToDsh = () => {
      // this.props.onSuccess();
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
        <form className="login">
        <div className={classes.wrapper}>
          <div className={classes.login}>
                <div>
                    <h1> UCLEI </h1>
                    <div className="welcomeMsg">
                      <h3 className="welcome">Welcome,</h3>
                      <p className="welcomeMsgTxt"> We're happy to see you back.</p>
                    </div>
                </div>

                <div className="lgnTxtFlds">

                  <TextField id={this.state.id} className="txtFld" label="Username" error={this.state.error}
                  InputProps={{className: classes.input}} helperText={this.state.helperText}
                  variant="outlined" onChange = {this.setUsername} value = {this.state.username} />


                  <TextField id={this.state.id} helperText={this.state.helperTextPsw} error={this.state.error}
                  className="txtFld" label="Password" variant="outlined"
                  InputProps={{className: classes.input}}
                  onChange = {this.setPassword} value = {this.state.password} />

                </div>
              </div>
              <UncontrolledLottie className={classes.lottie}/>
            </div>

            <div >
              <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>             
              <Button className={classes.lgnBtn} variant="contained" color="secondary" onClick={this.register}>Register</Button>
           
              
            </div>


        </form>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Login))
