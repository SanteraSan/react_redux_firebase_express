import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";


function Navbar(props) {
    return (
        <AppBar>
            <ToolBar className="nav-container">
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </ToolBar>
        </AppBar>
    );
}

export default Navbar;