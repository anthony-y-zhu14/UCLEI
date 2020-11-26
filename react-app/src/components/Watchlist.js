import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import QueueIcon from '@material-ui/icons/Queue';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose'

const styles = {
  root: {
    width: '100%',
    margin: '1% auto',
    maxWidth: 360,
    borderRadius: '2%',
    color: '#000',
  },
  inner: {
    marginTop: '4%',
    padding: '4%',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '4%'
  }
};

class CheckboxList extends React.Component {
  constructor() {
      super();
      this.state = {
          userWatchlist: undefined,
          selectedStock: undefined,
          view: false
        };
  }

  componentDidMount() {
    // Calls our fetch below once the component mounts
  this.callBackendAPI()
    .then(res => this.setState({ userWatchlist: res }))
    .catch(err => console.log(err));
  }
  // Fetches our GET route to account info from server.js
  callBackendAPI = async () => {
    const response = await fetch('/getWatchlist');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  delWatchItem = async(id) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: id })
    };
    await fetch('/delWatchItem', requestOptions);
    // const data = await response.json();

    this.callBackendAPI()
    .then(res => this.setState({ userWatchlist: res }))
    .catch(err => console.log(err));
  }

  viewWatchItem = async(value) => {
      let location = {
        pathname: `/market/${value}`,
        state: {
          query: value
        }
      }
      this.props.history.push(location);
  }

  componentDidUpdate() {
     if (this.props.onChange) {
       this.props.onChange(this.state);
     }
   }

  render() {
    const { classes } = this.props;

    if(!this.state.userWatchlist) {
      return (
        <h1>401 Not Authorized...</h1>
      )
    }

    return (
      <List className={classes.root}>
        {this.state.userWatchlist.map((value) => {
          const labelId = ``;


          return (
            <ListItem className={classes.inner}>
              <IconButton onClick={() => this.viewWatchItem(value.symbol)}>
                <QueueIcon/>
              </IconButton>
              <ListItemText id={labelId} primary={value.symbol}/>
              <ListItemText id={labelId} primary={value.quote}/>
              <ListItemText id={labelId} primary={value.volume}/>
              <ListItemText id={labelId} primary={value.name}/>
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.delWatchItem(value.symbol)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
  }
}
export default compose(
   withStyles(styles),
)(withRouter(CheckboxList))
