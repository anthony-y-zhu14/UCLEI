import React from 'react';
import GridList from "../GridList.js";
import Header from "../Header.js";

class Dashboard extends React.Component {


    render() {
      return (
          <div>
            <Header />
            <GridList />
          </div>
      );
    }
  };

  export default Dashboard;
