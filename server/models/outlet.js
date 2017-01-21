// Shop
var mongoose = require('mongoose');

var outletSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Outlet", outletSchema);