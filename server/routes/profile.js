var jwt      = require('jsonwebtoken');
var express  = require('express');

var routes = function (passport, User) {
    
    var router = express.Router();
    
    router.use(passport.authenticate('jwt', { session: false }));

    router.get('/', function (req, res) {
        User.findOne({
            account: req.user
        }, '-__v -createdAt').populate(
            'account', 'email roles'
        ).populate(
            'addresses', '-__v -createdAt'
        ).exec(function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
            } else if (user) {
                if (user.account.roles == 'User') {
                    user.account.roles = undefined;
                }
                res.status(200).json({ success: true, profile: user });
            } else {
                console.log(req.user);
                res.status(404).json({ success: false, message: 'Can\'t find user profile!' });
            }
        });
    });

    router.patch('/', function (req, res) {
        User.
            findOne({
                account: req.user
            }, '-__v -createdAt').
            exec(function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
                } else if (user) {
                    if (req.body.name)
                        user.name = req.body.name;
                    if (req.body.phoneNumber)
                        user.phoneNumber = req.body.phoneNumber;
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ success: false, message: 'Unable to save ' });
                        }
                        res.status(200).json({ success: true, profile: user });
                    });
                } else {
                    console.log(req.user);
                    res.status(404).json({ success: false, message: 'Can\'t find user profile!' });
                }
            });
    });

    return router;
}
module.exports = routes;