import React from "react";
import './App.css';
import {Route, Switch} from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
//Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

const theme = createMuiTheme({
    palette:{
        primary:{
            light:'#4791db',
            main:'#1976d2',
            dark:'#115293',
            contrastText:'#fff'
        },
        secondary:{
            light:'#e33371',
            main:'#dc004e',
            dark:'#9a0036',
            contrastText:'#fff'
        }
    },
    typography:{
        useNextvariants:true
    },
    form: {
        textAlign: "center"
    },
    image: {
        maxHeight: 100
    },
    // pageTitle: {}

    textField:{
        textAlign:"center",
        margin:10
    },
    customError:{
        color:"red",
        fontSize:"0.9rem",
        marginTop:15
    },
    button:{
        marginTop:30,
        position:"relative"
    },
    small:{
        display:"block",
        marginTop:20
    },
    progress:{
        position:"absolute",
        textAlign:"center",
        height:"90%"
    }
})

let authenticated;
const token = localStorage.FBIdToken;
if (token){
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()){
        window.location.href = `/login`;
        authenticated = false;
    }else{
        authenticated = true;
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Navbar/>
                <div className="container">
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <AuthRoute exact path='/login' component={Login} authenticated={authenticated}/>
                        <AuthRoute exact path='/signup' component={SignUp} authenticated={authenticated}/>
                    </Switch>
                </div>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
