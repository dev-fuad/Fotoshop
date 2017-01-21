'use strict'
var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport   = require('passport');
var jwt        = require('jwt-simple');
var helmet     = require('helmet');

var config     = require('./helpers/config.secret');

var app = express();

mongoose.connect(config.database);
var Address    = require('./models/address');
var Account    = require('./models/account');
var User       = require('./models/user');
var Outlet     = require('./models/outlet');
var OrderImage = require('./models/order-image');
var Order      = require('./models/order');

mongoose.Promise = global.Promise;

var routes     = require('./routes/index');
var users      = require('./routes/users');
var profile    = require('./routes/profile')(passport, User, Account, Address);
var outlets    = require('./routes/outlet')(passport, Outlet, Address);
var orders     = require('./routes/order')(passport, Order, OrderImage, User, Outlet, Address);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());

app.use(passport.initialize());
require('./helpers/passport-strategy')(passport, config);

app.use('/', routes);
app.use('/user', users);
app.use('/profile', profile);
app.use('/outlet', outlets);
app.use('/order', orders);

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
    res.json({
      "message": err.message,
      "error": err
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