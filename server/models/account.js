var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var accountSchema = new mongoose.Schema({
    login_type: { type: String, enum: ['Facebook', 'Normal'], default: 'Normal' },
    email: { type: String, required: true, unique: true },
    fbId: String,           // Facebook Id for managing FB profiles
    password: String,	    // hash created from password
	createdAt: { type: Date, default: Date.now }
});

accountSchema.methods.matchPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        return cb(null, isMatch);
    });
};

var isValidEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

accountSchema.methods.isValid = function () {
    var errorStrings = [];
    if (this.email == "") {
        errorStrings.push('Email is required');
    }
    if (this.password == "" && this.fbId == "") {
        if (this.login_type == 'Normal') {
            errorStrings.push('Password is required');
        } else {
            errorStrings.push('Facebook Id is required');
        }    
    }
    if (!isValidEmail(this.email)) {
        errorStrings.push('Email is not valid');
    }
    return errorStrings;
}

accountSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

module.exports = mongoose.model("Account", accountSchema);