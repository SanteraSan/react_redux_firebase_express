import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import AppLogo from "../uploads/hipster.svg"
//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as axios from "axios";
import {Link} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";


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


function Login(props) {

    const [state, setState] = useState({
        email: '',
        password: '',
        loading: false,
        errors: {}
    });
    const classes = useStyles();
    let handleSubmit = (e) => {
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            loading: true
        }));
        const userData ={
            email:state.email,
            password:state.password
        }
        axios.post('/login',userData)
            .then(res =>{
                console.log(res.data);
                setState(prevState => ({
                    ...prevState,
                    loading: false
                }));
                props.history.push('/');
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
            })
            .catch(err =>{
                setState(prevState => ({
                    ...prevState,
                    errors: err.response.data,
                    loading:false
                }));
            })
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
                    <Button className={classes.button} disabled={state.loading} type="submit" variant="contained" color="primary">
                        Войти
                        {state.loading && (
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

export default Login;