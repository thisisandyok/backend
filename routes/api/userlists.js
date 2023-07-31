const express = require('express');
const router = express.Router();

// Load List model
const List = require('../../models/List');
const Session = require("../../models/Session");


router.get('/', async (req, res) => {
    const session = req.cookies.session_id;
    await Session.findOne({session_id : session})
        .then( async (session) => {
            if(session) {
                List.find({owner: session.user})
                    .then(list => res.json(list));
            }
        });


});

module.exports = router;
