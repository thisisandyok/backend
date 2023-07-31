const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({

    created_date: {
        type: Date,
        default: Date.now
    },
    login_date: {
        type: Date
    },
    password_date: {
        type: Date
    },
    membership_expiration_date: {
        type: Date
    },
    banned: {
        type: Boolean,
        default: false
    },
    email: {
        type : String,
        required: true,
        index: { unique: true }
    },
    email_verified: {
        type : Boolean,
        default: false
    },
    password: {
        type : String,
        required: true
    },
    lists: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'list',
        default: ["64b1a12053d259f92089dd0b","64a9b28fc477cbe5072016e1","64b1984753d259f92089dd06"]
    } ]
});

UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = User = mongoose.model('user', UserSchema);
