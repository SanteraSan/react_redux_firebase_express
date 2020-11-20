import React, {useEffect, useRef, useState} from 'react';
import AppLogo from "../uploads/hipster.svg"
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
//MUI
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
//Redux stuff
import { connect } from "react-redux"
import {loginUser} from "../redux/actions/userAction";


const useStyles = makeStyles({
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
});


const Login =(props)=>{
    // debugger
    const [state, setState] = useState({
        email: '',
        password: '',
        errors: {}
    });
    const isFirstRun = useRef(true);
    useEffect (() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        setState(prevState => ({
            ...prevState,
            errors: props.UI.errors
        }));
    }, [props.UI.errors]);
    const classes = useStyles();
    let handleSubmit = (e) => {
        e.preventDefault();
        const userData ={
            email:state.email,
            password:state.password
        };
        props.loginUser(userData,props.history)
    };
    const handleChange = e => {
        setState(prevState => ({
            ...prevState,
        [e.target.name]: e.target.value
        }));
    };
    return (

        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={AppLogo} alt="hipster" className={classes.image}/>
                <Typography variant="h2" >
                    Вход
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        id="email"
                        name="email"
                        label="Адрес электронной почты"
                        className={classes.textField}
                        value={state.email}
                        helperText={state.errors.email}
                        error={!!state.errors.email}
                        onChange={handleChange}
                        fullWidth/>
                        <TextField
                        id="password"
                        name="password"
                        label="Пароль"
                        type="password"
                        className={classes.textField}
                        value={state.password}
                        helperText={state.errors.password }
                        error={!!state.errors.password}
                        onChange={handleChange}
                        fullWidth/>
                    {state.errors.general &&(
                        <Typography variant="body2" className={classes.customError}>
                            {state.errors.general}
                        </Typography>
                    )}
                    <Button className={classes.button} disabled={props.UI.loading} type="submit" variant="contained" color="primary">
                        Войти
                        {props.UI.loading && (
                            <CircularProgress color="primary" className={classes.progress}/>
                        )}
                    </Button>
                    <small className={classes.small}>Ещё не зарегестрированы? Вам <Link to="/signup">сюда</Link> !</small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    );
}

Login.propTypes ={
    classes:PropTypes.object.isRequired,
    loginUser:PropTypes.func.isRequired,
    user:PropTypes.object.isRequired,
    UI:PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user:state.user,
    UI:state.UI
});

export default connect(mapStateToProps,{loginUser})(Login);