const {db} = require("../utility/admin");

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
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage:doc.data().userImage
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
        userImage: req.user.imageUrl,
        time: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };
    db
        .collection('screams')
        .add(newScreams)
        .then(doc => {
            const resScream = newScreams;
            resScream.screamId = doc.id;
            res.json({resScream})
        })
        .catch(err => console.error(err))
};

exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({error: 'Не найдено!!!'});
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
            res.status(500).json({error: err.code});
        });
};

// Comment on a comment
exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '')
        return res.status(400).json({comment: 'Поле не должно быть пустым'});

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
                return res.status(404).json({ error: 'что-то не найдено!!!' });
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
// Like a scream
exports.likeScream = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Сообщение на найдено' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return db
                    .collection('likes')
                    .add({
                        screamId: req.params.screamId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        screamData.likeCount++;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        return res.json(screamData);
                    });
            } else {
                return res.status(400).json({ error: 'Вы уже лайкали это сообщение' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.unlikeScream = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Сообщение не найдено' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: 'Scream not liked' });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        res.json(screamData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};
//Delete a scream
exports.deleteScream = (req, res) => {
    const document = db.doc(`/screams/${req.params.screamId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Сообщение не найдено' });
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Вы не авторизованы' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Сообщение удалено' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};