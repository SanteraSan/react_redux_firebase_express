import React from "react";
import './App.css';
import {Route, Switch} from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
//Components
import Navbar from "./components/Navbar";

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
    }
})

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Navbar/>
                <div className="container">
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/signup' component={SignUp}/>
                    </Switch>
                </div>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
