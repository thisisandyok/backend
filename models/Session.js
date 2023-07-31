const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({

    created_date: {
        type: Date,
        default: Date.now
    },
    user: {
        type : mongoose.Schema.Types.ObjectId, ref: 'user',
        required: true
    },
    session_id: {
        type: String,
        required: true
    }
});

module.exports = Session = mongoose.model('session', SessionSchema);
