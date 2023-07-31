let ObjectId = require('mongodb').ObjectId;
const connectDB = require('./config/db');
const Post = require('./models/Post');
const axios = require('axios');

void connectDB();


(async () => {


    for await (const doc of Post.find({favicon : null})
        .select('-description -hiders -title -list -reactions')
        .sort({found_date: 1})
        .limit(150)) {

        let favicon = await axios.get('https://www.google.com/s2/favicons?domain=' + doc.url, {
            responseType: 'arraybuffer'
        }).then((response) => {
            Buffer.from(response.data, 'binary').toString('base64')
            Post.findOneAndUpdate({_id: new ObjectId(doc._id)}, {favicon: favicon})
                .catch(err => err);
        })
        .catch(err => (error) => {console.log('no')})

    }

    process.exit();
})();


