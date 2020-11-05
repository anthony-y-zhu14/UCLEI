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

const styles = {
  root: {
    width: '100%',
    margin: '1% auto',
    maxWidth: 360,
    borderRadius: '2%',
    color: '#000',
  },
  inner: {
    marginTop: '-4%',
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
          userWatchlist: undefined
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
    const response = await fetch('/delWatchItem', requestOptions);
    const data = await response.json();
  }

  viewWatchItem = async(id) => {
    //should be get request with query param as id
    const response = await fetch(`/stock-data?search=${id}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    console.log(body)
    return body;
  }

  render() {
    const { classes } = this.props;

    if(!this.state.userWatchlist) {
      return (
        <h1>Loading...</h1>
      )
    }

    return (
      <List className={classes.root} onChange={this.componentDidMount()}>
        {this.state.userWatchlist.map((value) => {
          const labelId = ``;


          return (
            <ListItem className={classes.inner}>
              <IconButton>
                <QueueIcon onClick={() => this.viewWatchItem(value)}/>
              </IconButton>
              <ListItemText id={labelId} primary={value}/>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon onClick={() => this.delWatchItem(value)}/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
  }
}

export default  withStyles(styles)(CheckboxList);
