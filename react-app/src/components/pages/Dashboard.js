import React from 'react';
import GridList from "../GridList.js";
import Header from "../Header.js";
import SpacingGrid from "../Grid.js";
import SimpleContainer from "../Container.js"
import Typography from '@material-ui/core/Typography';

import { withStyles } from "@material-ui/core/styles";

const styles = {
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 'md',
    justifyContent: 'space-between',
    margin: '1%',
    zIndex: 2
  },
  font: {
    color: 'white',
    position: 'relative',
    fontSize: '24px',
    zIndex: 10
  }
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
  };
    render() {

      const { classes } = this.props;

      return (
          <div>
            <Header currentPage={`Dashboard`}/>
            <div className={classes.main}>
              <SimpleContainer>

              </SimpleContainer>
              <SimpleContainer />
            </div>
          </div>
      );
    }
  };

  export default withStyles(styles)(Dashboard);
