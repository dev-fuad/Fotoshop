var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
	name: { type: String, default: 'New Address' },
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Address", addressSchema);