var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    orderImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderImage' }],
    type: { type: String, enum: ['Classic', 'Priority', 'Urgent'], default: 'Classic' },       
    status: { type: String, enum: ['Order Placed', 'Downloaded at printing station', 'Printed', 'Sent to Pick-up Store', 'Sent to mail', 'Received from Store', 'Delivered to Customer'], default: 'Order Placed' },
    mailTrackCode: String,
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);