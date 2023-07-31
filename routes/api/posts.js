const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const Session = require("../../models/Session");
const User = require("../../models/User");


async function getPostsForLoggedInUser(res, user, heat) {

    if(heat) {
        await Post.find({ 'hiders': { '$ne':  user._id}, 'heat': {'$lt' : heat}, 'list': { '$in' : user.lists } })
            .select('-description -hiders')
            .populate({
                path: 'promoted',
                match: { user: user._id }
            })
            .populate({
                path: 'demoted',
                match: { user: user._id }
            })
            .populate({
                path: 'savedpost',
                match: { user: user._id }
            })
            .populate({
                path: 'clicked',
                match: { user: user._id }
            })
            .populate('clicks')
            .populate({
                path: 'list',
                options: {select: '_id name'}
            })
            .sort({heat: -1, published_date: -1})
            .limit(30)
            .then(posts => res.json(posts))
            .catch(err => res.status(404).json({ nopostsfound: 'No Posts found', err: err }));
    } else {
        await Post.find({ 'hiders': { '$ne':  user._id}, 'heat': {'$ne' : 0}, 'list': { '$in' : user.lists } } )
            .select('-description -hiders')
            .populate({
                path: 'promoted',
                match: { user: user._id }
            })
            .populate({
                path: 'demoted',
                match: { user: user._id }
            })
            .populate({
                path: 'savedpost',
                match: { user: user._id }
            })
            .populate({
                path: 'clicked',
                match: { user: user._id }
            })
            .populate('clicks')
            .populate({
                path: 'list',
                options: {select: '_id name'}
            })
            .sort({heat: -1, published_date: -1})
            .limit(30)
            .then(posts => res.json(posts))
            .catch(err => res.status(500).json({ nopostsfound: 'No Posts found', err: err }));
    }
}


async function getPostsForAnonUser(res, heat) {
    let lists = ["64b1a12053d259f92089dd0b","64a9b28fc477cbe5072016e1","64b1984753d259f92089dd06"];
    let user = { _id : '64b2b2a32d9557540600ca46', lists : lists };
    await getPostsForLoggedInUser(res, user, heat);
}

// @route GET api/posts
// @description Get all posts
// @access Public
router.get('/', async (req, res) => {
    const session = req.cookies.session_id;
    const heat = req.query.page;

    if(session) {
        await Session.findOne({session_id: session})
            .then((session) => {
                User.findOne({_id: session.user})
                    .then((user) => {
                        if (user) {
                            getPostsForLoggedInUser(res, user, heat);
                        } else {
                            getPostsForAnonUser(res, heat);
                        }
                    })
                    .catch(err => res.status(422).json({err: err}));
            })
            .catch(err => res.status(422).json({err: err}));
    } else {
        await getPostsForAnonUser(res, heat);
    }
});

// @route GET api/posts/:id
// @description Get single post by id
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .populate('list')
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No Post found' }));
});


module.exports = router;
