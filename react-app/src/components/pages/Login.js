import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import "../css/Styles.css";


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
      return (
        <form className="login">
            <div>
                <h1> UCLEI </h1>
                <h3 className="welcome">Welcome,</h3>
                <span className="welcome-message-text">We're happy to see you back.</span>

            </div>

            <TextField id="outlined-basic" label="Username" 
            variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
        

            <TextField id="outlined-basic" label="Password" variant="outlined" 
            onChange = {this.setPassword} value = {this.state.password} />

        
            <Button variant="contained" color="primary" onClick={() => {
                  alert(this.state.username + " " + this.state.password);
                }}>
            Login
            </Button>
        </form>
      );
    }
  };
  
  export default Login;