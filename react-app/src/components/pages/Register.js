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
  register: {
    width: '60%',
    marginLeft: '10%'
  },
  Btn: {
    marginLeft: '12%'
  }
};

class Register extends React.Component {
  _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            fullName: "",
            password: "",
            rePassword: "",
            helperText: '',
            helperTextPsw: '',
            id: 'outlined-basic',
            authenticated: 'onload',
            error: false,
        };
        this.register = this.register.bind(this);
    } 

    componentWillUnmount() {
      this.setState = ()=>{
        return;
      };
    }

    register = async () => {
      this._isMounted = true;
      if(this.state.username && this.state.password && this.state.fullName){

        if(this.state.password !== this.state.rePassword){
          this.setState({ id: 'outlined-error-helper-text', helperTextPsw: 'Passwords not Matching', error: true})
          return;
        }

        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.state.username, password: this.state.password , name: this.state.fullName})
        };
        const response = await fetch('/register', requestOptions);
        const data = await response.json();
        this.setState({ authenticated: data.authentication});
        this.props.onChange(data.session_id);
        
        if(this.state.authenticate === 'onload') {
          this.setState({ id: 'outlined-basic', helperText: '', error: false})
        }
        else if(!this.state.authenticate) {
          this.setState({ id: 'outlined-error-helper-text', helperText: 'Username Already Exists', error: true})
        }
        if(this.state.authenticated) {  
          this.navToDsh();
        }
      }
      else{
        alert("Please fill out all the info");
        return;
      }
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

    setRePassword = event =>{
      this.setState ({
        rePassword: event.target.value
      });
    }

    setFullName = event =>{
      this.setState({
        fullName: event.target.value
      })
    }

    render() {
      const { classes } = this.props;      

      return (
        <form className="login">
        <div className={classes.wrapper}>
          <div className={classes.register}>
                <div>
                    <h1> UCLEI </h1>
                    <div className="welcomeMsg">
                      <h3 className="welcome">Welcome,</h3>
                      <p className="welcomeMsgTxt"> We're happy to have you.</p>
                    </div>
                </div>

                <div className="lgnTxtFlds">

                  <TextField id={this.state.id} className="txtFld" label="Enter Your Username" error={this.state.error}
                  InputProps={{className: classes.input}} helperText={this.state.helperText}
                  variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                  <TextField id={this.state.id} className="txtFld" label="First Name and Last Name" error={this.state.error}
                  InputProps={{className: classes.input}} variant="outlined" onChange = {this.setFullName} value = {this.state.fullName} />


                  <TextField id={this.state.id} helperText={this.state.helperTextPsw} error={this.state.error}
                  className="txtFld" label="Enter Your Password" variant="outlined"
                  InputProps={{className: classes.input}}
                  onChange = {this.setPassword} value = {this.state.password} />

                  <TextField id={this.state.id} helperText={this.state.helperTextPsw} error={this.state.error}
                  className="txtFld" label="Confirm Password" variant="outlined"
                  InputProps={{className: classes.input}}
                  onChange = {this.setRePassword} value = {this.state.Repassword} />

                </div>
              </div>
              <UncontrolledLottie className={classes.lottie}/>
            </div>

            <div >
              <Button className={classes.Btn} variant="contained" color="primary" onClick={this.register}>Register</Button>
            </div>


        </form>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Register))
