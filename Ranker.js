let ObjectId = require('mongodb').ObjectId;
const connectDB = require('./config/db');
const User = require('./models/User');
const Upvote = require('./models/Upvote');
const Reaction = require('./models/Reaction');
const Downvote = require('./models/Downvote');
const Click = require('./models/Click');
const Post = require('./models/Post');

void connectDB();

function calculateScore(promoted, demoted, clicks, reactions,  datePosted) {
    //the reddit and hackernews math doesn't work great at my small scale, revisit this if the site starts getting some traffic
    //Wilson Score Interval

    return (promoted + (clicks * .3) + (reactions * .5) - demoted - ((new Date() - new Date(datePosted)) / 86400000));

}

(async () => {
    console.log("applying ranking to posts");

    //calculate ranking for posts during the past 3 months
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    for await (const doc of Post.find({"found_date" : {"$gte": sixMonthsAgo}})
        .select('-description -hiders -title -url -lists')
        .populate('promoted')
        .populate('demoted')
        .populate('reactions')
        .populate('clicks')
        .sort({published_date: -1})) {

        const score = calculateScore(doc.promoted, doc.demoted, doc.clicks, doc.reactions.length, doc.published_date);

        Post.findOneAndUpdate({_id: new ObjectId(doc._id)}, {heat: score})
            .then(posts => posts)
            .catch(err => err);
    }

    //clear heat for posts older than 3 months (ignore records older than 4 months)
    await Post.updateMany({"found_date" : {"$lt": sixMonthsAgo, "$gt": sevenMonthsAgo}}, {"heat" : 0 } );

    process.exit();
})();


