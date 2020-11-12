const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require( "./handle/screams");
const {
    logIn,
    signUp,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require("./handle/users");
const FBAuth = require("./utility/fbAuth");

const functions = require('firebase-functions');
const express = require('express');
const app = express();

//Scream routs

app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId',getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);


//users routs

app.post('/sign-up', signUp);
app.post('/login', logIn);
app.post('/user/image',FBAuth, uploadImage);
app.post('/user',FBAuth, addUserDetails);
app.get('/user',FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);