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


function SignUp(props) {

    const [state, setState] = useState({
        email: '',
        password: '',
        confirmPassword:'',
        handle:'',
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
        const newUserData ={
            email:state.email,
            password:state.password,
            confirmPassword:state.confirmPassword,
            handle:state.handle
        }
        axios.post('/sign-up',newUserData)
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
                    Регистрация
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
                        <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Повторите пароль"
                        type="password"
                        className={classes.textField}
                        value={state.confirmPassword}
                        helperText={state.errors.password }
                        error={!!state.errors.password}
                        onChange={handleChange}
                        fullWidth/>
                        <TextField
                        id="handle"
                        name="handle"
                        label="Имя профиля"
                        type="text"
                        className={classes.textField}
                        value={state.handle}
                        helperText={state.errors.handle }
                        error={!!state.errors.handle}
                        onChange={handleChange}
                        fullWidth/>
                    {state.errors.general &&(
                        <Typography variant="body2" className={classes.customError}>
                            {state.errors.general}
                        </Typography>
                    )}
                    <Button className={classes.button} disabled={state.loading} type="submit" variant="contained" color="primary">
                        Зарегистрироваться
                        {state.loading && (
                            <CircularProgress color="primary" className={classes.progress}/>
                        )}
                    </Button>
                    <small className={classes.small}>Уже зарегестрированы? Тогда Вам <Link to="/login">сюда</Link> !</small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    );
}

export default SignUp;