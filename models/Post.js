const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    site_title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    published_date: {
        type: Date
    },
    found_date: {
        type: Date,
        default: Date.now
    },
    hiders: [{type : mongoose.Schema.Types.ObjectId, ref: 'user'}],
    reactions: [{type : mongoose.Schema.Types.ObjectId, ref: 'user'}],
    list: { type : mongoose.Schema.Types.ObjectId, ref: 'list' },
    heat: {
        type: Number,
        default: 0
    },
    favicon: {
        type: String
    }
});

PostSchema.set('toObject', { virtuals: true })
PostSchema.set('toJSON', { virtuals: true })

PostSchema.virtual('promoted', {
    ref: 'upvote',
    localField: '_id',
    foreignField: 'post',
    count: true
});

PostSchema.virtual('demoted', {
    ref: 'downvote',
    localField: '_id',
    foreignField: 'post',
    count: true
});

PostSchema.virtual('clicks', {
    ref: 'click',
    localField: '_id',
    foreignField: 'post',
    count: true
});

PostSchema.virtual('clicked', {
    ref: 'click',
    localField: '_id',
    foreignField: 'post',
    count: true
});

PostSchema.virtual('savedpost', {
    ref: 'save',
    localField: '_id',
    foreignField: 'post',
    count: true
});

module.exports = Post = mongoose.model('post', PostSchema, 'posts');
