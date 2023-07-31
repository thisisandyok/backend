const express = require('express');
const router = express.Router();

const Clicks = require('../../models/Click');
const Session = require("../../models/Session");



router.put('/', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( (session) => {
            if(session) {
                Clicks.replaceOne({user: session.user, post: req.body.post}, {
                    user: session.user,
                    post: req.body.post
                }, {upsert: true})
                    .then(book => res.json({msg: 'Updated successfully'}))
                    .catch(err =>
                        res.status(400).json({error: 'Failed to record click'})
                    );
            }
        });
});

module.exports = router;
