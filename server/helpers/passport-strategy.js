var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;

var UserAccount = require('../models/account');

module.exports = function (passport, config) {
    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        UserAccount.findOne({ id: jwtPayload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
    }))
}