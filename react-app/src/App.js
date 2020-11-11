import React, {useEffect, useState} from 'react';
import { 
    BrowserRouter as Router, 
    Route,
    Switch,
    Link,
    Redirect} from 'react-router-dom';
import "./components/Header.js"
import Market from "./components/pages/Market.js"
import Account from "./components/pages/Account.js"
import Trading from './components/pages/Trading';
import Login from './components/pages/Login.js';
import Dashboard from './components/pages/Dashboard.js';
import AuthApi from './AuthApi';


function App(){

    const [auth, setAuth] = useState(null); 

   function handleChange(newAuth){  
        setAuth(newAuth);
    }

    useEffect(()=>{      
        console.log(auth);
        },[auth]);


    return (
    <React.Fragment>
        <AuthApi.Provider value={{auth, setAuth}}> 
            <Router>
                <Switch>                    
                    <Route 
                        path="/login" 
                        component={() => <Login session_id={auth} onChange={handleChange} />}
                        /> 
                    <Routes/>       
                </Switch>                   
                              
            </Router>
        </AuthApi.Provider>
    </React.Fragment>
   
    )    
}


const Routes = () =>{
    const Auth = React.useContext(AuthApi)
    return (
        <Switch>                
            <ProtectedRoute path="/dashboard" auth={Auth.auth} component={Dashboard}/>

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
                    <Redirect to='/login' />
                )
            }   
        />
    )
}


export default App;
