const express = require('express');
const router = express.Router();

const Saves = require('../../models/Save');
const Session = require("../../models/Session");


router.delete('/', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                await Saves.deleteOne({user: session.user, post: req.body.post})
                    .then(book => res.json({msg: 'Deleted successfully'}))
                    .catch(err =>
                        res.status(500).json({error: 'Failed to delete save'})
                    );
            }
        })
});


router.put('/', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                await Saves.replaceOne({user: session.user, post: req.body.post}, {
                    user: session.user,
                    post: req.body.post
                }, {upsert: true})
                    .then(book => res.json({msg: 'Updated successfully'}))
                    .catch(err =>
                        res.status(500).json({error: 'Failed to record save'})
                    );
            }
        })
});

router.get('/', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                await Saves.find({user: session.user})
                    .populate({path:'posts', options: {sort: {'published_date': -1}, select: '-description'}})
                    .then(post => res.json(post))
                    .catch(err =>
                        res.status(500).json({error: 'Failed to record save'})
                    );
            }
        })
});

module.exports = router;
