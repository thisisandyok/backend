const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId, ref: 'user'
    },
    urls: [{
        type: String
    }],
    created_date: {
        type: Date
    },
    updated_date: {
        type: Date
    },
});

ListSchema.set('toObject', { virtuals: true })
ListSchema.set('toJSON', { virtuals: true })

ListSchema.virtual('posts', {
    ref: 'post',
    localField: '_id',
    foreignField: 'list',
});

module.exports = List = mongoose.model('list', ListSchema);
