const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const Session = require('../../models/Session');
const { v4: uuidv4 } = require('uuid');



router.post('/', async (req, res) => {

    await User.findOne({ email:  req.body.email})
        .then(async (user) => {
        // test a matching password
        user.comparePassword(req.body.password, async function(err, isMatch) {
            await Session.create({user: user._id, session_id: uuidv4()})
                .then(session => res.json({session : session.session_id}))
                .catch(err => res.status(500).json({ err: err }));

        });
    }).catch(err => res.status(422).json({ err: err }));

});


module.exports = router;
