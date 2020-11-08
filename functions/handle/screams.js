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
