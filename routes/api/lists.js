const express = require('express');
const router = express.Router();

// Load List model
const List = require('../../models/List');
const Session = require("../../models/Session");

// @route GET api/lists
// @description Get all lists
// @access Public
router.get('/', (req, res) => {
    List.find()
        .then(lists => res.json(lists))
        .catch(err => res.status(404).json({ nolistsfound: 'No Lists found' }));
});

// @route GET api/lists/:id
// @description Get single list by id
// @access Public
router.get('/:id', (req, res) => {
    List.findById(req.params.id)
        .populate({path:'posts', options: {sort: {'published_date': -1}, select: '-description'}})
        .limit(150)
        .then(list => res.json(list))
        .catch(err => res.status(404).json({ nolistfound: 'No List found', err: err }));
});


module.exports = router;
