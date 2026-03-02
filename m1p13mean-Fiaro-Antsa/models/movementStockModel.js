const mongoose = require('mongoose');

const movementStockShema = new mongoose.Schema({
    movementDate: { type: Date, required: true, default: Date.now },
    type: {
        type: String,
        enum: ['ENTRY','RELEASE'],
        required: true
    },
    quantity: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    variant: {
        type: String,
        required: false
    }
});

const MovementStock = mongoose.model('MovementStock', movementStockShema, 'MovementStocks');

module.exports = { MovementStock };