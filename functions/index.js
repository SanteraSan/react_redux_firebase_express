const {getAllScreams, postOneScream} = require( "./handle/screams");
const {logIn, signUp, uploadImage} = require("./handle/users");
const FBAuth = require("./utility/fbAuth");

const functions = require('firebase-functions');
const express = require('express');
const app = express();

//Scream routs

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

//users routs

app.post('/sign-up', signUp);
app.post('/login', logIn);
app.post('/user/image',FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);