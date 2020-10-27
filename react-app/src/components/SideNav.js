import React from "react";
import "./css/SideNav.css";


class Sidenav extends React.Component {  
        
    
    render() {
    return(
            
            <div id="sidenav">
                <h3 id="sidenav-title">UCLEI</h3>
                <ul id="sidenav-list">
                <li>                
                    <i className='fa fa-dashboard'></i>
                    Dashboard</li>
                <li>                
                    <i className="fa fa-credit-card" aria-hidden="true"></i>
                    Account
                    </li>
                <li>
                    <i className="fa fa-exchange" aria-hidden="true"></i>
                    Trading</li>
                <li>
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                    Market
                </li>
                </ul>
                <div id="add-funds">
                <a id="add-funds-link">
                    <i className='fa fa-plus-circle'></i>
                    Add Funds</a>
                </div>            
            </div>
        );
    }

    

   
}


  

export default Sidenav;