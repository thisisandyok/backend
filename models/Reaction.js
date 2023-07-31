const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({

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
    type: {
        type : String
    },

});

module.exports = Reaction = mongoose.model('reaction', ReactionSchema);
