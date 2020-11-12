import React, {useEffect, useState} from 'react';
import { 
    BrowserRouter as Router, 
    Route,
    Switch,
    Redirect} from 'react-router-dom';
import "./components/Header.js"
import Market from "./components/pages/Market.js"
import Account from "./components/pages/Account.js"
import Trading from './components/pages/Trading';
import Login from './components/pages/Login.js';
import Dashboard from './components/pages/Dashboard.js';
import StoreFront from './components/pages/StoreFront.js';
import Register from './components/pages/Register.js';


function App(){
    const [auth, setAuth] = useState(undefined); 

    function handleChange(newAuth){ 
            
            setAuth(newAuth);
        }

    useEffect(()=>{   
      
        if (auth === undefined){
            fetch('/session')
            .then((res) => res.json())
            .then((data) => setAuth(data))
            .catch((error) => console.log(error.message));    
        }             
                    
    },[auth]);  
   


    return (
    <React.Fragment>     
            <Router>            
                    <Switch>
                        
                        <Route 
                        path="/login" 
                        component={() => <Login session_id={auth} onChange={handleChange} />}
                        />

                        <Route path="/register"  component={Register}/>
                        
                        
                        <Route  exact path="/" component={StoreFront}/>                       
                        <Route path="/dashboard"  component={() => <Dashboard session_id={auth}/>}/>
                        <Route path="/account"  component={() => <Account session_id={auth}/>}/>
                        <Route path="/market"  component={() => <Market session_id={auth}/>}/>
                        <Route path="/trading"  component={() => <Trading session_id={auth}/>}/>
                    </Switch>                                       
            </Router>    
    </React.Fragment>
    )    
}


export default App;
