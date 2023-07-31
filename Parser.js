let Parser = require('rss-parser');
let ObjectId = require('mongodb').ObjectId;
const connectDB = require('./config/db');
const List = require('./models/List');
const Post = require('./models/Post');


let parser = new Parser({
    headers: {'User-Agent': 'Laffo.com RSS Parser'},
    requestOptions: {
        rejectUnauthorized: false
    }
});


void connectDB();

//This is admittedly a hack and needs TLC:
//1. Deal with feeds behind Cloudflare
//2. Only parse URLs once, skip if they were part of a previous list

(async () => {
    console.log("starting rss scrape");

    for await (const doc of List.find()) {
        for await (const url of doc.urls) {

            try {
                let feed = await parser.parseURL(url);
                for await (const item of feed.items) {

                    const postCount = await Post.countDocuments({url: item.link, list: doc._id});

                    if (postCount < 1) {

                        let desc = '';
                        if (item.content) {
                            desc = item.content;
                        } else if (item.description) {
                            desc = item.description;
                        }

                        let author = '';
                        if (item.author && item.author.name && !item.author.name.includes('@blogger.com')) {
                            author = item.author;
                        }else if (item.author && !item.author.includes('@blogger.com')) {
                            author = item.author;
                        } else if (item.creator && !item.creator.includes('@blogger.com')) {
                            author = item.creator;
                        }

                        let title = '';
                        if (item.title) {
                            title = item.title;
                        } else {
                            title = feed.title + ' ' + item.pubDate;
                        }

                        let site_title = '';
                        if(feed.title == 'GANNETT Syndication Service') {
                            site_title = feed.author;
                            author = item.creator;
                        } else {
                            site_title = feed.title;
                        }


                        let published_date = '';
                        if (item.pubDate) {
                            published_date = item.pubDate;
                        } else {
                            published_date = new Date();
                        }

                        await Post.insertMany([
                            {
                                title: title,
                                site_title: site_title,
                                description: desc,
                                url: item.link,
                                author: author,
                                type: 'post',
                                published_date: published_date,
                                list: new ObjectId(doc._id)
                            }]
                        );
                    };
                }
            } catch (e) {
                console.log("[" + new Date() + "] unable to get " + url);
                console.log(e);
            }
        }
    }
    process.exit();
})();


