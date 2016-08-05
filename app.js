var express = require('express');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var comb = require('comb');
comb.logger.configure();
var log = comb.logger('ss');
log.level = 'ALL';

var app = express();

var api = require('./routes/api/api');
var routes = require('./routes/index');
var login = require('./routes/login');
var streams = require('./routes/streams');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new SQLiteStore,
  secret: 'your secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

app.use('/', routes);
app.use('/login', login);
app.use('/streams', streams);
app.use('/api/streams', api.streams);

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


module.exports = app;
