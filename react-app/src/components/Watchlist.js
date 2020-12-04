import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import QueueIcon from '@material-ui/icons/Queue';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box, Container } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose'

const styles = {
  root: {
    background: '#202023',
    color: '#fff',
    borderRadius: '10px',
    margin: "1%",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    overflowY: 'auto',
    height: '40%'

  },
  listCard: {
    background: '#222024',
    color: '#fff',
    margin: "1%",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

  },
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
      <React.Fragment>
        <Container className={classes.root}>
          <h3>Watchlist</h3>
          {this.state.userWatchlist.map(value => (
            <Accordion className={classes.listCard}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header">
                <Box p={{ xs: 1 }}>
                  <Typography>{value.name}, ({value.symbol})</Typography>
                </Box>
                <Tooltip title="View Stock">
                  <IconButton onClick={() => this.viewWatchItem(value.symbol)}>
                    <QueueIcon style={{fill: "#fff"}}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton onClick={() => this.delWatchItem(value.symbol)} edge="end" aria-label="delete">
                    <DeleteIcon style={{fill: "#fff"}}/>
                  </IconButton>
                </Tooltip>
              </AccordionSummary>
              <AccordionDetails>
                <Box p={{ xs: 1 }}><p>Today's Quote: ${value.quote}</p></Box>
                <Box p={{ xs: 1 }}><p>Today's Volume: ${value.volume}</p></Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </React.Fragment>
    );
  }
}

export default compose(
   withStyles(styles),
)(withRouter(CheckboxList))
