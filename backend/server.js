const express		 = require('express');
const session        = require('express-session');
const hbs            = require('express-handlebars');
const mongoose       = require('mongoose');
const Grid           = require('gridfs-stream');
const cors           = require('cors');
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');

const https          = require('https');
const fs             = require('fs');
const { connect }    = require('http2');
const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
};

const methodOverride = require('method-override');

const connection     = require('./db.js');
const UserInDb       = require('./models/SignUp.js');
const SignUpRoutes   = require('./routes/SignUp.js');
const UploadRoutes   = require('./routes/Uploads.js');
const PostsRoutes    = require('./routes/Posts.js');
const ChatRoutes     = require('./routes/Chat.js');
const JobRoutes      = require('./routes/Jobs.js');
const SearchRoutes   = require('./routes/Search.js');
const NewUser        = require('./models/SignUp');

const app = express();

// Connect to db
connection();

// Init gfs
let gfs;

mongoose.connection.once('open', () => {
  // Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Middleware
app.engine('hbs', hbs({ extname: '.hbs' }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('/home/smackflad/Documents/uni/6o/tedi/Project/TediProject/Antonis/tediproject/src' + '/public'));
app.use(session({
    secret: "verygoodsecret",
    resave: false,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

////////////////////////

app.use('/users', SignUpRoutes);
app.use('/upload', UploadRoutes);
app.use('/posts', PostsRoutes);
app.use('/chat', ChatRoutes);
app.use('/jobs', JobRoutes);
app.use('/search', SearchRoutes);

/////////////////////////////// LOGIN ROUTES

app.post('/login', async (req, res) => {

    const user = await UserInDb.findOne({ email: req.body.email })
    .then(async (result) => {
        if (result) {
            const check = await bcrypt.compare(req.body.password, result.password);

            if (check == false) {
                res.send({flag: false, message: 'Incorrect password.' });
                return {};
            }
            else {
                // res.send(result);
                return result;
            }
        }
        else
            res.send({ flag: false, message: 'Incorrect email.' });
    })
    .catch((err) => {
        console.log(err);
    });

    jwt.sign({user: user}, 'secretkey', (err, token) => {
        res.json({
            flag: true,
            token,
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            ProfilePic: user.ProfilePic,
            number: user.number,
            Education: user.Education
        });
    });
});

// TOKEN FORMAT
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    
    // Check bearer
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');

        // Get token for array
        req.token = bearer[1];
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/check', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {

        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                iat: authData.iat
            })
        }
    });
})

app.use('/', (req, res) => {
    // console.log('this is a test')
    res.send('hello');
    // res.render('index');
});

https.createServer(options, app).listen(8000, '127.0.0.1',function() {
    let securePassword;

    // Make admin
    const used = NewUser.findOne({ email: "admin" })
    .then((result) => {
        if (result == null) {
            void async function() {
                securePassword = await bcrypt.hash("admin", 10)

                const user = new NewUser ({
                    firstname: "admin",
                    lastname: "admin",
                    email: "admin",
                    password: securePassword,
                });

                user.save();
            }();
        }
    })
    .catch((err) => {
        console.log(err);
    });
  });