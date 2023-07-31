const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Session = require("../../models/Session");



router.put('/', async (req, res) => {
    const session = req.cookies.session_id;
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                await Post.updateOne({_id: req.body.post}, {$addToSet: {hiders: session.user}})
                    .then(post => res.json({msg: 'Updated successfully'}))
                    .catch(err => res.status(400).json({error: 'Failed to record hide'})
                    );
            }
        });
});

module.exports = router;
