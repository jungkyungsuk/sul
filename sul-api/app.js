var config = require('./config/config')();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var aws = require('aws-sdk');

var app = express();

app.use(session({
    store: new RedisStore({
      host: config.redis.host,
      db: config.redis.database,
    }),
    secret: '952549e2c351f3df1e9ee45fb5b10e52',
    resave: false,
    saveUninitialized: true
}));


var database = require('./config/database')(config, app);
var passport = require('./config/passport')(config, app, session, database);

var index = require('./routes/index')(app);
var router_auth = require('./routes/auth')(passport, database);
var router_post = require('./routes/post')(config, passport, database, aws);
var router_message = require('./routes/message')(passport, database);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

app.use(function(req, res, next) {
  var list =[
    {method: 'POST', url: '/post'},
    {method: 'PUT', url: '/post'},
    {method: 'DELETE', url: '/post'},
    {method: 'GET', url: '/post/form'}
  ];

  for(var index in list) {
    var item = list[index];

    if (item.method == req.method && item.url == req._parsedOriginalUrl.pathname) {
      console.log('user', req.user);
      if (!req.user) {
        return res.status(401).send('no user');
      }
    }
  }
  next();
});

app.use('/', index);
app.use('/auth', router_auth);
app.use('/post', router_post);
app.use('/message', router_message);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
