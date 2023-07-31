const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');
//const morgan = require('morgan');
const path = require('path')
const cookieParser = require('cookie-parser');

// routes
const lists = require('./routes/api/lists');
const userlists = require('./routes/api/userlists');
const posts = require('./routes/api/posts');
const clicks= require('./routes/api/clicks');
const upvotes= require('./routes/api/upvotes');
const downvotes= require('./routes/api/downvotes');
const hides= require('./routes/api/hides');
const saves= require('./routes/api/saves');
const search= require('./routes/api/search');
const user= require('./routes/api/user');
const login= require('./routes/api/login');
const subscription = require('./routes/api/subscription');

const app = express();

// Connect Database
void connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
//app.use(morgan(':remote-addr - :remote-user.js [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user.js-agent"', {stream : accessLogStream}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello world!'));

app.use('/api/posts', posts);
app.use('/api/lists', lists);
app.use('/api/userlists', userlists);
app.use('/api/clicks', clicks);
app.use('/api/promotes', upvotes);
app.use('/api/demotes', downvotes);
app.use('/api/hides', hides);
app.use('/api/saves', saves);
app.use('/api/search', search);
app.use('/api/user', user);
app.use('/api/login', login);
app.use('/api/subscription', subscription);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));

