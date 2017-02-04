var jwt      = require('jsonwebtoken');
var express  = require('express');

var routes = function (passport, User, Account, Address) {
    
    var router = express.Router();
    
    router.use(passport.authenticate('jwt', { session: false }));

    router.use('/', function (req, res, next) {
        User.findOne({
            account: req.user
        }).populate(
            'addresses', '-__v -createdAt'
        ).exec(function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
            } else {
                req.userProfile = user;
                next();
            }
        });
    });

    router.get('/', function (req, res) {
        if (!req.userProfile) {
            res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
        } else if (req.userProfile.addresses && req.userProfile.addresses.length > 0) {
            res.status(200).json({ success: true, addresses: req.userProfile.addresses });
        } else {
            console.log(req.userProfile);
            res.status(404).json({ success: false, message: 'Can\'t find user addresses!' });
        }
    });

    router.post('/', function (req, res) {
        if (!req.userProfile) {
            res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
        } else {
            if (req.body.address && req.body.address.addressLine1 && req.body.address.city &&
            req.body.address.state && req.body.address.country) {
                var newAddress = new Address({
                    name: req.body.address.name,
                    addressLine1: req.body.address.addressLine1,
                    addressLine2: req.body.address.addressLine2,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    country: req.body.address.country,
                });
                newAddress.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ success: false, message: 'Unable to save address' });
                    } else {
                        req.userProfile.addresses.push(newAddress);
                        req.userProfile.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ success: false, error: 'Unable to save User address' });
                            } else {
                                res.json({ success: true, message: 'Successfully added new address.' });
                            }
                        });
                    }
                })
            }
        }
    });

    router.use('/:id', function (req, res, next) { 
        User.
            findOne({
                account: req.user,
                addresses: req.params.id
            }, {
                'addresses.$': 1
            }).
            populate('addresses', '-__v -createdAt').
            exec(function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
                } else {
                    req.address = user.addresses[0];
                    next();
                }
            });
    })

    router.patch('/:id', function (req, res) {
        if (!req.userProfile) {
            res.status(500).json({ success: false, message: 'Can\'t find user profile!' });
        } else if (req.address) {
            if (req.body.name)
                req.address.name = req.body.name;
            if (req.body.addressLine1)
                req.address.addressLine1 = req.body.addressLine1;
            if (req.body.addressLine2)
                req.address.addressLine2 = req.body.addressLine2;
            if (req.body.city)
                req.address.city = req.body.city;
            if (req.body.state)
                req.address.state = req.body.state;
            if (req.body.country)
                req.address.country = req.body.country;
            req.address.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Unable to save address' });
                }
                res.status(200).json({ success: true, profile: req.address });
            });
        } else {
            console.log(req.userProfile);
            res.status(404).json({ success: false, message: 'Can\'t find user address!' });
        }
    });

    router.delete('/:id', function (req, res) {
        if (!req.userProfile) {
            res.status(500).json({ success: false, message: 'Can\'t find user' });
        } else {
            Address.remove({ _id: req.params.id }, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: 'Unable to delete address' });
                } else {
                    res.status(200).json({ success: true, message: 'Address deleted successfully' });
                }
            });
        }
    });

    return router;
}
module.exports = routes;