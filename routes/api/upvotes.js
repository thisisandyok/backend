const express = require('express');
const router = express.Router();

const Upvote = require('../../models/Upvote');
const Downvote = require('../../models/Downvote');
const Session = require("../../models/Session");



router.put('/', async (req, res) => {
    const session = req.cookies.session_id;
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                await Downvote.findOneAndDelete({user: session.user, post: req.body.post});
                await Upvote.replaceOne({user: session.user, post: req.body.post}, {
                    user: session.user,
                    post: req.body.post
                }, {upsert: true})
                    .then(book => res.json({msg: 'Updated successfully'}))
                    .catch(err =>
                        res.status(400).json({error: 'Failed to record upvote'})
                    );
            }
        });
});

module.exports = router;
