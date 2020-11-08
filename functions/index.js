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

const FBAuth = (req, res, next) =>{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.error('Not fount token');
        return res.status(403).json({error:'Unauthorized'})
    }
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken =>{
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(dat =>{
            req.user.handle = dat.docs[0].data().handle;
            return next();
        })
        .catch(err=>{
            console.error('Error while verifying token ',err);
            return res.status(403).json(err);
        })
}

//Post one scream
app.post('/scream', FBAuth, (req, res) => {
    const newScreams = {
        body: req.body.body,
        userHandle: req.user.handle,
        time: new Date().toISOString()
    };
    db
        .collection('screams')
        .add(newScreams)
        .then(doc => {
            res.json({message: `документ ${doc.id} создан`})
        })
        .catch(err => console.error(err))
});

//Sign-up route
const isEmail = (email) =>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)){
        return true
    }else{
        return false
    }
}

const isEmpty = (checkString) => {
    return checkString.trim() === "";
};

app.post('/sign-up', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    let errors = {};
    if(isEmpty(newUser.email)){
        errors.email = 'Поле должно быть заполненно'
    }else if(!isEmail(newUser.email)){
        errors.email = "Введите корректный адрем почты"
    }
    if (isEmpty(newUser.password)){
        errors.password = 'Поле должно быть заполненно'
    }
    if (newUser.password !== newUser.confirmPassword){
        errors.password = 'Пароли должны совпадать'
    }
    if (isEmpty(newUser.handle)){
        errors.handle = 'Поле должно быть заполненно'
    }

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    //TODO validate data
    let tokenId, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({handle: 'Такой пользователь уже сцществует'})
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
                return res.status(400).json({error: 'Адресс почты уже используется'})
            } else {
                return res.status(500).json({error: err.code})
            }
        })
});

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    let loginErrors = {};
    if (isEmpty(user.email)){
        loginErrors.email = 'Поле должно быть заполнено'
    }
    if (isEmpty(user.password)){
        loginErrors.password = 'Поле должно быть заполнено'
    }
    if(Object.keys(loginErrors).length > 0) return res.status(400).json({loginErrors})

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => data.user.getIdToken())
        .then(token => res.json({token}))
        .catch(err =>{
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email'){
                return res.status(401).json({general:"Ошибка аутентификации, попробуйте снова"})
            }
            return res.status(500).json({error:err.code})
        })
})

exports.api = functions.https.onRequest(app);