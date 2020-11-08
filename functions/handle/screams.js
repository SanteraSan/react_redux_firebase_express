const { db } = require("../utility/admin");

exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
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
};

exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Не найдено!!!' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then((data) => {
            screamData.comments = [];
            data.forEach((doc) => {
                screamData.comments.push(doc.data());
            });
            return res.json(screamData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

// Comment on a comment
exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '')
        return res.status(400).json({ comment: 'Поле не должно быть пустым' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };
    console.log(newComment);

    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Не найдено!!!!' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Что-то пошло не так' });
        });
};