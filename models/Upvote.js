const mongoose = require('mongoose');

const UpvoteSchema = new mongoose.Schema({

    created_date: {
        type: Date,
        default: Date.now
    },
    user: {
        type : mongoose.Schema.Types.ObjectId, ref: 'user'
    },
    post: {
        type : mongoose.Schema.Types.ObjectId, ref: 'post'
    },

});

module.exports = Upvote = mongoose.model('upvote', UpvoteSchema, 'upvotes');
