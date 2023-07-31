const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

// @route GET api/posts
// @description Get all posts
// @access Public
router.get('/', (req, res) => {

    const term = req.query.term;
    if(term) {
        Post.find({$or: [{description: {$regex: '.*' + term + '.*'}}, {title: {$regex: '.*' + term + '.*'}}, {author: {$regex: '.*' + term + '.*'}}, {url: {$regex: '.*' + term + '.*'}}, {site_title: {$regex: '.*' + term + '.*'}}]},)
            .select('-description -hiders')
            .populate({path: 'list', options: {select: '_id name'}})
            .populate('clicks')
            .limit(200)
            .then(posts => res.json(posts))
            .catch(err => res.status(404).json({nopostsfound: 'No Posts found', err: err}));
    }
});

module.exports = router;
