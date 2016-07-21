var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Database connections
var mongo = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/nodetest1');
var db = monk('a032a9c9d08244a5aaa0e3cab71f2795/iad2-c6-0.mongo.objectrocket.com:52088,iad2-c6-2.mongo.objectrocket.com:52088,iad2-c6-1.mongo.objectrocket.com:52088');

db.then(() => {
    console.log('Connected correctly to server')
})

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

//Session
app.use(cookieParser());
app.use(session({secret:'somesecrettokenhere'}));
app.use(bodyParser());

// app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
// console.log('executes always');
module.exports = app;
