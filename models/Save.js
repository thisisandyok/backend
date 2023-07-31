const mongoose = require('mongoose');

const SaveSchema = new mongoose.Schema({

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

SaveSchema.set('toObject', { virtuals: true })
SaveSchema.set('toJSON', { virtuals: true })

SaveSchema.virtual('posts', {
    ref: 'post',
    localField: 'post',
    foreignField: '_id'
});


module.exports = Save = mongoose.model('save', SaveSchema, 'saves');
