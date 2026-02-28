const mongoose = require('mongoose');
const { Shop } = require('./userModel');

const boxSchema = new mongoose.Schema({
    floor: { type: Number, required: true },
    number: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
        default: 'AVAILABLE'
    },
    image: { type: String },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

const Box = mongoose.model('Box', boxSchema, 'Boxes');

module.exports = { Box };