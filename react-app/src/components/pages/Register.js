import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose'
import  { Breakpoint} from 'react-socks';
import UncontrolledLottie from "../UncontrolledLottie";
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
    color: "#fff"
  },
  inputS: {
    color: "#fff",
    width: 150,
  },
  inputL: {
    color: "#fff",
    width: 250
  },
  inputXL: {
    color: "#fff",
    width: 350,
  },
  wrapper: {
    background: '#202023',
    color: '#fff',
    borderRadius: '10px',
    margin: "1%",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    alignText: 'center',
    margin: '5% auto',
    padding: '2%',
    width: '60%',
  },
  wrapperXL: {
    background: '#202023',
    color: '#fff',
    borderRadius: 20,
    margin: "2%",
    boxShadow: '0px 14px 14px rgba(0, 0, 0, 0.25)',
    alignText: 'center',
    margin: '2% auto',
    padding: '2%',
    width: '600px',
  },
  lottie: {
    width: '20%',
    position: 'relative',
    margin: '5%'
  },
  Btn: {
    height: 40
  },
  rgsTxtFlds : {
    display: 'flex',
    flexWrap: 'wrap',
  },
  rgsTxtFldsXL : {
    display: 'flex',
    flexWrap: 'wrap',
    width: '50%'
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
            errorPsw: false
        };
        this.register = this.register.bind(this);
    } 

    componentWillUnmount() {
      this.setState = ()=>{
        return;
      };
    }

    componentDidMount(){
      if (this.props.session_id){
        this.navToDsh();
      }
    }

    register = async () => {
      this._isMounted = true;

      if(this.state.username && this.state.password && this.state.fullName){

        this.setState({ id: 'outlined-error-helper-text', helperTextPsw: '', errorPsw: false})


        if(this.state.password !== this.state.rePassword){
          this.setState({ id: 'outlined-error-helper-text', helperTextPsw: 'Passwords not Matching', errorPsw: true})
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
        console.log(data)
        this.props.onChange(data.session_id);
        
        if(this.state.authenticated === 'onload') {
          this.setState({ id: 'outlined-basic', helperText: '', error: false})
        }
        if(this.state.authenticated === 'usernameError') {
          this.setState({ id: 'outlined-error-helper-text', helperText: 'Username Already Exists', error: true})
        }
        if(this.state.authenticated === 'true') {  
          this.navToDsh();
        }
      }
      else{
        alert("Please fill out all the info");
        return;
      }
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

    textFields = (clssSize) => {
      const { classes } = this.props;      
      const textFields = (
            <Grid container>
              <Grid item xs={6}>
                <TextField id={this.state.id} label="Enter Your Username" error={this.state.error}
                InputProps={clssSize} helperText={this.state.helperText}
                variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                <TextField id={this.state.id} label="First and Last Name" error={this.state.nameError}
                InputProps={clssSize} variant="outlined" onChange = {this.setFullName} value = {this.state.fullName} />
                <TextField id={this.state.id} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                label="Enter Your Password" variant="outlined" type='password'
                InputProps={clssSize}
                onChange = {this.setPassword} value = {this.state.password} />
                <TextField id={this.state.id} helperText={this.state.helperTextPsw} error={this.state.errorPsw}
                label="Confirm Password" variant="outlined" type='password'
                InputProps={clssSize}
                onChange = {this.setRePassword} value = {this.state.Repassword} />
              </Grid>
              <Grid item xs={10} style={{marginTop: '2%'}}>
                <Button className={classes.Btn} variant="contained" color="primary" onClick={this.register}>Register</Button>
              </Grid>
            </Grid>
      )

      return textFields;
    }

    render() {
      const { classes } = this.props;      

      return (
        <form>
          <Breakpoint small down>
              <div className={classes.wrapper}>
                <h1> UCLEI </h1>
                <h3>Welcome,</h3>
                <p>Let's get you ready to trade.</p>
                <div className={classes.rgsTxtFlds}>
                  {this.textFields({classes: {input: classes.inputS}})}
                </div>
              </div>
          </Breakpoint>
          <Breakpoint medium>
              <div className={classes.wrapper}>
                <h1> UCLEI </h1>
                <h3>Welcome,</h3>
                <p>Let's get you ready to trade.</p>
                <div className={classes.rgsTxtFlds}>
                  {this.textFields({classes: {input: classes.inputL}})}
                </div>
              </div>
          </Breakpoint>
          <Breakpoint large up>
              <div className={classes.wrapperXL}>
                <h1> UCLEI </h1>
                <div style={{width: 20, marginTop: -150, marginLeft: 400, position: 'absolute'}}>
                <UncontrolledLottie/>
                  </div>
                <h3>Welcome,</h3>
                <p>Let's get you ready to trade.</p>
                <div className={classes.rgsTxtFldsXL}>
                  {this.textFields({classes: {input: classes.inputXL}})}
         
                </div>
                
              </div>
          </Breakpoint>
        </form>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Register))
