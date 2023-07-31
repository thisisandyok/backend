const express = require('express');
const router = express.Router();

const Session = require("../../models/Session");
const User = require("../../models/User");

router.put('/', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                //add subscription to user list of subs
                await User.findById(session.user)
                    .then((user) => {
                        if(!user.lists.includes(req.body.list)) {
                            user.lists.push(req.body.list);
                            user.save();
                        }
                    })
                    .then(post => res.json({msg: 'Updated successfully'}));
            }
        });

});

router.delete('/:id', async (req, res) => {
    const session = req.cookies.session_id;
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                //remove subscription from user list of subs
                await User.findOneAndUpdate({_id: session.user},{ '$pull': {'lists': req.params.id } })
                    .then(post => res.json({msg: 'Updated successfully'}));
            }
        });

});


module.exports = router;
