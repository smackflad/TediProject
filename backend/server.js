const express		 = require('express');
const session        = require('express-session');
const hbs            = require('express-handlebars');
const mongoose       = require('mongoose');
const Grid           = require('gridfs-stream');
const cors           = require('cors');
const passport       = require('passport');
const localStrategy  = require('passport-local');
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
// const hbs            = require('hbs');

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
const LogInRoutes    = require('./routes/LogIn.js');
const SignUpRoutes   = require('./routes/SignUp.js');
const UploadRoutes   = require('./routes/Uploads.js');
const PostsRoutes    = require('./routes/Posts.js');
const ChatRoutes     = require('./routes/Chat.js');
const JobRoutes      = require('./routes/Jobs.js');
const SearchRoutes   = require('./routes/Search.js');

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
// 
// Middleware
app.engine('hbs', hbs({ extname: '.hbs' }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('/home/smackflad/Documents/uni/6o/tedi/Project/TediProject/Antonis/tediproject/src' + '/public'));
// console.log(__dirname);
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
    res.send('hello');
    // res.render('index');
});

https.createServer(options, app).listen(8000);

const MF = require('./matrix_factorization');
R = [

    [5,3,0,1],

    [4,0,0,1],

    [1,1,0,5],

    [1,0,0,4],

    [0,1,5,4],
   
    [2,1,3,0],

   ]

// R = numpy.array(R)

N = R.length

M = R[0].length

K = 3

P = Array(N).fill().map(()=>Array(K).fill(parseFloat(Math.random().toFixed(10))));
Q = Array(M).fill().map(()=>Array(K).fill(parseFloat(Math.random().toFixed(10))));
Q = [[0.39462365, 0.59207692, 0.40479814],
[0.36852803, 0.83375616, 0.51138182],
[0.36195022, 0.07230487, 0.4764241],
[0.83216094, 0.31451178, 0.91289456]]

const nR = MF.matrix_factorization(R, P, Q, K)

// n[1] = MF.transpose(n[1]);
console.log(nR)