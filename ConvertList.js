let ObjectId = require('mongodb').ObjectId;
const connectDB = require('./config/db');
const Post = require('./models/Post');

void connectDB();


(async () => {
    console.log("applying ranking to posts");

    //calculate ranking for posts during the past 3 months
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);


    for await (const doc of Post.find()
        .select('-description -hiders -title -url')
        .sort({published_date: -1})) {

        Post.findOneAndUpdate({_id: new ObjectId(doc._id)}, {list: doc.lists[0]})
            .then(posts => posts)
            .catch(err => err);
    }

    //clear heat for posts older than 3 months (ignore records older than 4 months)
    await Post.updateMany({"found_date" : {"$lt": sixMonthsAgo, "$gt": sevenMonthsAgo}}, {"heat" : 0 } );

    process.exit();
})();


