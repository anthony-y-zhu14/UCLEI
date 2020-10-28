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
    marginLeft: '12%'
  }
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            authenticated: false
        };
    }

    componentDidMount = async () => {
        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.state.username, password: this.state.password })
        };
        const response = await fetch('/authentication', requestOptions);
        const data = await response.json();
        this.setState({ authenticated: data });
        if(this.state.authenticated) {
          this.navToDsh();
        }
    }

    navToDsh = (value) => {
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

                  <TextField id="outlined-basic" className="txtFld" label="Username"
                  InputProps={{className: classes.input}}
                  variant="outlined" onChange = {this.setUsername} value = {this.state.username} />


                  <TextField id="outlined-basic"
                  className="txtFld" label="Password" variant="outlined"
                  InputProps={{className: classes.input}}
                  onChange = {this.setPassword} value = {this.state.password} />

                </div>
              </div>
              <UncontrolledLottie className={classes.lottie}/>
            </div>

            <div >
              <Button className={classes.lgnBtn} variant="contained" color="primary" onClick={this.componentDidMount}>
              Login
              </Button>
            </div>


        </form>
      );
    }
  };

  export default compose(
     withStyles(styles),
  )(withRouter(Login))
