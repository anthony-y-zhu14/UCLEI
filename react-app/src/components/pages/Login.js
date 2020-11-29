import React from 'react';
import Button from '@material-ui/core/Button';
import  { Breakpoint, BreakpointProvider } from 'react-socks';
import { TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import UncontrolledLottie from "../UncontrolledLottie";
import {withRouter} from 'react-router-dom';
import compose from 'recompose/compose'

const styles = {
  root: {
    color: "#fff"
  },
  lTitle: {
    fontSize: 56
  },
  lFont: {
    fontSize: 48
  },
  xlTitle: {
    fontsize: 200
  },
  loginContainer: {
    margin: '3% auto',
    paddingBottom: '4%',
    width: '55%',
    background: '#393B41',
    color: '#fff',
    borderRadius: 15,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },
  LloginContainer: {
    margin: '2% auto',
    paddingBottom: '4%',
    fontSize: 40,
    width: '85%',
    background: '#393B41',
    color: '#fff',
    borderRadius: 15,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },
  input: {
    color: "#fff",
  },
  lBtn: {
    width: 200,
    fontSize: 24,
    height: 80
  },
  Linput: {
    color: "#fff",
    fontSize: 40
  },
  LWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '3%',
    width: 4000
  },
  xsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '8%',
    width: '80%'
  },
  sWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '5%',
    width: '100%'
  },
  lottie: {
    margin: '5%',
    float: 'right',
  },
  sbuttonContainer: {
    marginTop: 10,
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  xsbuttonContainer: {
    marginTop: 10,
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  LbuttonContainer: {
    width: '80%',
    marginLeft: -100,
    marginTop: 20
  },
  innerContainer : {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  txtFldCont : {
    width: '40%',
    float: 'left',
    fontSize: 48
  },
  txtFld: {
    display: 'flex',
    width: 250,
  },
  xstxtFldCont : {
    width: '100%',
  },
  xstxtFld: {
    display: 'flex',
    width: 180,
  },
  LtxtFld: {
    display: 'flex',
    width: 480,
    fontSize: 48
  },
  LtxtFldCont : {
    width: '40%',
    float: 'left',
    fontSize: 40
  },
  lottieCont: {
    width: '40%',
    marginTop: -50,
    marginLeft: 50,
    float: 'right'
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
    componentDidMount() {
      fetch('/session')
            .then((res) => res.json())
            .then((data) => this.setState({
              authenticated : data
            }))
            .finally(() =>{
              if (this.state.authenticated){
                this.navToDsh();
              }
            })
            .catch((error) => console.log(error.message));
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
                    <TextField id={this.state.id} className={classes.LtxtFld} label="Username" error={this.state.error}
                    InputProps={{classes: {
                      input: classes.Linput,
                      },
                    }} helperText={this.state.helperText}
                    InputLabelProps={{style:{fontSize:40}}}

                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.LtxtFld} helperText={this.state.helperTextPsw} error={this.state.error}
                    label="Password" variant="outlined" type="password"
                    InputProps={{classes: {
                      input: classes.Linput,
                      },
                    }}
                    InputLabelProps={{style:{fontSize:40}}}
                    onChange = {this.setPassword} value = {this.state.password} />
                  </div>
                  <div className={classes.lottieCont}>
                  </div>
                  <div className={classes.LbuttonContainer}>
                    <Button className={classes.lBtn} variant="contained" color="primary" onClick={this.login}>Login</Button>
                    <Button className={classes.lBtn} variant="contained" color="secondary" onClick={this.register}>Register</Button>
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
                    <TextField id={this.state.id} className={classes.txtFld} label="Username" error={this.state.error}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.txtFld} helperText={this.state.helperTextPsw} error={this.state.error}
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
                  <Button className={classes.rgsBtn} variant="contained" color="secondary" onClick={this.register}>Register</Button>
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
                    <TextField id={this.state.id} className={classes.txtFld} label="Username" error={this.state.error}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.txtFld} helperText={this.state.helperTextPsw} error={this.state.error}
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
                  <Button className={classes.rgsBtn} variant="contained" color="secondary" onClick={this.register}>Register</Button>
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
                    <TextField id={this.state.id} className={classes.xstxtFld} label="Username" error={this.state.error}
                    InputProps={{className: classes.input}} helperText={this.state.helperText}
                    variant="outlined" onChange = {this.setUsername} value = {this.state.username} />
                    <TextField className={classes.xstxtFld} helperText={this.state.helperTextPsw} error={this.state.error}
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
                  <Button className={classes.rgsBtn} variant="contained" color="secondary" onClick={this.register}>Register</Button>
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
