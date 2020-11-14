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
import AuthApi from './AuthApi';


function App(){
    const [auth, setAuth] = useState(undefined); 

    function handleChange(newAuth){  
            setAuth(newAuth);
        }

    useEffect(()=>{    
        console.log("auth: ", auth);   
        if (auth === undefined){
            fetch('/session')
            .then((res) => res.json())
            .then((data) => setAuth(data))
            .catch((error) => console.log(error.message));    
        }             
                    
    },[auth]);
    
    if(!auth) {
        return (
            <React.Fragment>                   
                <Router>
                    <Route 
                    path="/login" 
                    component={() => <Login session_id={auth} onChange={handleChange} />}
                    />                               
                </Router>
            
        </React.Fragment>
        )
    }


    return (
    <React.Fragment>
        <AuthApi.Provider value={{auth}}> 
            <Router>                                           
                <Routes/>                                                  
            </Router>
        </AuthApi.Provider>
    </React.Fragment>

    )    
}


const Routes = () =>{
    const Auth = React.useContext(AuthApi)
    const auth=Auth.auth;
    return (
        <Switch>                
            <ProtectedRoute path="/dashboard"  component={() => <Dashboard session_id={auth}/>}/>

            <ProtectedRoute path="/account" auth={Auth.auth} component={Account} />

            <ProtectedRoute path="/trading" auth={Auth.auth} component={Trading} />

            <ProtectedRoute path="/market" auth={Auth.auth} component={Market} />
        
        </Switch>
    )
}

const ProtectedRoute = ({auth, component:Component,...rest}) => {
    return(
        <Route
            {...rest}
            render = {() =>auth? (
                <Component/>
            )          
            :
                (
                    // <Redirect to="/login"/>
                    <Component/>
                )
            }   
        />
    )
}




export default App;
