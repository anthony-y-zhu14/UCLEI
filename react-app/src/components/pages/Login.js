import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import "../css/Styles.css";

const styles = {
  root: {
    color: "#fff"
  },
  input: {
    color: "#fff"
  }
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
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

            <div className="lgnBtn">
              <Button variant="contained" color="primary" onClick={() => {
                    alert(this.state.username + " " + this.state.password);
                  }}>
              Login
              </Button>
            </div>


        </form>
      );
    }
  };

  export default withStyles(styles)(Login);
