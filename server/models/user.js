var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    name: { type: String, required: true },
    phoneNumber: String,
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
	createdAt: { type: Date, default: Date.now }
});

var isValidNumber = function (phoneNumber) {
  var re = /^\d{10}$/;
  return re.test(phoneNumber);
}

userSchema.methods.isValid = function () {
    var errorStrings = [];
    if (this.name == "") {
        errorStrings.push('Name is required');
    }
    if (this.phoneNumber != "" && !isValidNumber(this.phoneNumber)) {
        errorStrings.push('Phone number is not valid');
    }
    return errorStrings;
}

module.exports = mongoose.model("User", userSchema);