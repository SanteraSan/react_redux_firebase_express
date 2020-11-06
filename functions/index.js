const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const firebase = require('firebase');


const firebaseConfig = {
    apiKey: "AIzaSyCAfSp_tZ67D1u1Gei-_1pj1HQq1vGYHBA",
    authDomain: "someprojectnew.firebaseapp.com",
    databaseURL: "https://someprojectnew.firebaseio.com",
    projectId: "someprojectnew",
    storageBucket: "someprojectnew.appspot.com",
    messagingSenderId: "305448201217",
    appId: "1:305448201217:web:831dc608d22d3e4ac12400"
};

admin.initializeApp();
const db = admin.firestore();
firebase.initializeApp(firebaseConfig);

app.get('/screams', (req, res) => {
    db
        .collection('screams')
        .orderBy('time', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    time: doc.data().time,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount
                });
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});
app.post('/scream', (req, res) => {
    const newScreams = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        likeCount: req.body.likeCount,
        commentCount: req.body.commentCount,
        time: new Date().toISOString()
    };
    db
        .collection('screams')
        .add(newScreams)
        .then(doc => {
            res.json({message: `document ${doc.id} create successfully`})
        })
        .catch(err => console.error(err))
});

//Sign-up route

app.post('/sign-up', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    //TODO validate data
    let tokenId, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({handle: 'this handle already taken'})
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(token => {
            tokenId = token;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                time: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({token: tokenId})
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({error: 'Email already is use'})
            } else {
                return res.status(500).json({error: err.code})
            }
        })
});

exports.api = functions.https.onRequest(app);