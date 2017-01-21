var passport = require('passport');
var User     = require('../models/user');
var Account  = require('../models/account');
var Address  = require('../models/address');
var jwt      = require('jsonwebtoken');

var express  = require('express');
var router   = express.Router();

var config   = require('../helpers/config.secret');

// register user api [POST http://localhost:3000/users/signup]
// body {"username":"","password":""}
router.post('/signup', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, message: 'Please pass email and password.'});
  } else {
    var newUserAccount = new Account({
      password: req.body.password,
      email: req.body.email
      // fbId: req.body.fbId
    });
    // check if user fields are valid
    if (newUserAccount.isValid().count > 0) {
      console.log(newUserAccount.isValid());
    }
    // save the user
    newUserAccount.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, message: 'Email is already registered.'});
      }
      
      var newUserProfile = new User({
        name: (req.body.name == "") ? req.body.email : req.body.name,
        phoneNumber: req.body.phoneNumber,
        account: newUserAccount
      });

      if (req.body.address && (req.body.address.addressLine1 || req.body.address.city ||
      req.body.address.state || req.body.address.country)) {
        
            var address = new Address({
                name: req.body.address.name,
                addressLine1: req.body.address.addressLine1,
                addressLine2: req.body.address.addressLine2,
                city: req.body.address.city,
                state: req.body.address.state,
                country: req.body.address.country
            });
            address.save(function (err) {
              if (err) {
                console.log(err);
                return res.status(500).json({ success: false, error: 'Unable to save address' });
              }
              else {
                newUserProfile.addresses.push(address);
                newUserProfile.save(function (err) {
                  if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, error: 'Unable to save User information' });
                  } else {
                    res.json({ success: true, message: 'Successfully created new user.' });
                  }
                });
              }
            });
      } else {
        newUserProfile.save(function (err) {
          if (err) {
            console.log(err);
            res.status(500).json({ success: false, error: 'Unable to save User information' });
          } else {
            res.json({ success: true, message: 'Successfully created new user.' });
          }
        });
      }      
    });
  }
});

// authenticate user api [POST http://localhost:3000/users/authenticate]
router.post('/authenticate', function (req, res) {
  Account.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Username doesn\'t exists.' });
    } else {
      user.matchPassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret);

          res.json({ success: true, token: 'Bearer ' + token });
        } else {
          res.json({ success: false, message: 'Authentication failed.' });
        }
      });
    }
  });
});

module.exports = router;
