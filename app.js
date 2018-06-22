const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;
// check connection
db.once('open',function(){
  console.log('Connected to mongodb');
});

db.on('error',function(err){
  console.log(err);
});
// Init app
const app = express();
// Bring in models
let Article = require('./models/article');
let User = require('./models/user');
// load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Set Public folder
app.use(express.static(path.join(__dirname,'public')));
// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

// validator
app.use(expressValidator());

// passport config
require('./config/passport')(passport);
app.use(passport.initialize());
  app.use(passport.session());

// For using globally login
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


// Express flash message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// parse application/json
app.use(bodyParser.json());
// Home route
app.get('/',function(req,res){
  Article.find({},function(err,articles){
    if(err){
      console.log(err);
    }
    else{
      res.render('index',{
        title:'Hello',
        articles:articles
    });
    }


  });
});
// Route articles
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users',users);

// Start Server
app.listen(3000,function(){
  console.log('Server started on 3000');
});
