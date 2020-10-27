import React from 'react';
import GridList from "../GridList.js";
import Header from "../Header.js";
import SpacingGrid from "../Grid.js";

const Dashboard = ({user}) => {
  console.log({user});

      return (
          <div>
            <Header />
            <h1>{user}</h1>
          </div>
      );
  };

  export default Dashboard;
