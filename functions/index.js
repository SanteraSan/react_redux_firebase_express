const {getAllScreams, postOneScream} = require( "./handle/screams");
const {logIn, signUp} = require("./handle/users");
const FBAuth = require("./utility/fbAuth");

const functions = require('firebase-functions');
const express = require('express');
const app = express();

//
// const firebase = require("firebase");
// firebase.initializeApp(firebaseConfig);

//Scream routs

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

//users routs

app.post('/sign-up', signUp);
app.post('/login', logIn);

//Post one scream







exports.api = functions.https.onRequest(app);