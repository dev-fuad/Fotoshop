var mongoose = require('mongoose');

var orderImageSchema = new mongoose.Schema({
    link: String,
    size: { type: String, enum: ['10x15', '13x18', '15x21', '20x30', '30x45'] },
    paper: { type: String, enum: ['Bright', 'Glossy'] }
});

module.exports = mongoose.model("OrderImage", orderImageSchema);