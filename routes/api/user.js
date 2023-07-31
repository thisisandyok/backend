const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const Session = require('../../models/Session');
const { v4: uuidv4 } = require('uuid');



router.post('/', (req, res) => {

    if(req.body.password != req.body.confirmpassword) {
        res.status(422).json({err: 'Passwords do not match'});
    } else if (req.body.password.length < 8) {
        res.status(422).json({err: 'Please use a longer password'});
    } else {
        let user = User.create({email: req.body.email, password: req.body.password, lists: ["64b1a12053d259f92089dd0b","64a9b28fc477cbe5072016e1","64b1984753d259f92089dd06"]})
            .then(function(user) {
                Session.create({user: user._id, session_id: uuidv4()})
                    .then(session => res.json({session : session.session_id}))
                    .catch(err => res.status(500).json({ err: err }));
            })
            .catch(err => res.status(422).json({ err: err }));
    }
});

router.get('/', (req, res) => {
    const session = req.cookies.session_id;
    console.log(session);
    //TODO: I recently learned what "Callback Hell" is
    //TODO: looks like a promising solution: https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/
    Session.findOne({session_id : session})
        .then( (session) => {
            User.findOne({_id : session.user})
                .select('-password')
                .populate({path: 'lists', options: {select: '_id name'}})
                .then(user => res.json(user))
                .catch(err => res.status(422).json({ err: err }));
        })
        .catch(err => res.status(422).json({ err: err }));
});


//TODO: eh, later
router.put('/', (req, res) => {
    const username =req.body.username; // switch to session, get from db



});

module.exports = router;
