const {db} = require("../utility/admin");
const config = require("../utility/config");
const firebase = require("firebase");
const {validateSignupData, validateLoginData} = require("../utility/valodators");
firebase.initializeApp(config);


exports.signUp = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid,errors} = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

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
};

exports.logIn = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid,errors} = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

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
};