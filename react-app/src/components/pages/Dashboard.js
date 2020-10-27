import React from 'react';
import NewsList from "../NewsList.js";
import Header from "../Header.js";

class Dashboard extends React.Component {
       

    render() {
      return (
          <div>
            <Header />
            <NewsList />
          </div>
      );
    }
  };

  export default Dashboard;