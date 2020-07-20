require('dotenv').config();
var fs = require('fs');
var path = require('path');

var createError = require('http-errors');
var cookieSession = require('cookie-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var express = require('express');

var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resourceRouter = require('./routes/resource');

var app = express();

// we'll use a simple object as a 'database'
var users = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// setup various middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['change_me_oauth_test_key'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(express.static(path.join(__dirname, 'public')));

// setup passport with oauth and cookie sessions
app.use(passport.initialize());
app.use(passport.session());

// Pass config from our OAuth providers
passport.use(new OAuth2Strategy({
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
function(accessToken, refreshToken, profile, cb) {
  // get oauth providers public key to decrypt the jwt payload
  const cert = fs.readFileSync('jwt-client-secret');

  const decoded = jwt.verify(accessToken, cert, { algorithms: ['RS256', 'HS256'] });
  decoded.jwt = accessToken;
  console.log(decoded);

  // create a user based off the jwt data
  createUser(decoded);

  // pass the user object to passport
  return cb(null, decoded.user);
}
));

// serialise our user into the desired cookie content
passport.serializeUser(function(user, done) {
  done(null, user.userId);
});

// deserialise our cookie content into a user
passport.deserializeUser(function(id, done) {
  done(null, findUser(id));
});

// Define our different resource/view endpoints here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/resource', resourceRouter);

// the endpoint which starts the oauth login
app.get('/auth/login',
  passport.authenticate('oauth2'));
  
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("Succesful! Redirecting to root.")
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// look up a user's details in our 'db'
function findUser(id) {
  if(!fs.existsSync('users.json')){
    fs.writeFileSync('users.json', JSON.stringify({}));
  }
  const json = fs.readFileSync('users.json');
  users = JSON.parse(json);
  return users[id];
}

// create a user in our 'db'
function createUser(authObj = null) {
  if(!fs.existsSync('users.json')){
    fs.writeFileSync('users.json', JSON.stringify({}));
  }
  const json = fs.readFileSync('users.json');
  users = JSON.parse(json);
  const user = authObj.user;
  users[user.userId] = authObj;
  fs.writeFileSync('users.json', JSON.stringify(users));
  return users;
}

module.exports = app;
