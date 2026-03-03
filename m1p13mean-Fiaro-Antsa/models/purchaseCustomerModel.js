const mongoose = require('mongoose');
const { MovementStock } = require('./movementStockModel');

const purchaseCUstomerSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    detailsPurchase: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
    }],
    purchaseDate: { type: Date, default: Date.now, required: true },
    totalPriceGlobal: { type: Number, required: true }    
});

const PurchaseCustomer = mongoose.model('PurchaseCustomer', purchaseCUstomerSchema, 'PurchaseCustomers');

module.exports = { PurchaseCustomer };