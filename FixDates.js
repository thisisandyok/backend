let ObjectId = require('mongodb').ObjectId;
const connectDB = require('./config/db');
const Post = require('./models/Post');

void connectDB();


(async () => {


    for await (const doc of Post.find()
        .select('-description -hiders -title -url')) {

        if(!doc.published_date) {
            Post.findOneAndUpdate({_id: new ObjectId(doc._id)}, {published_date: doc.found_date})
                .catch(err => err);
        }
    }

    process.exit();
})();


