const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({  
    size: { type: String },
    color: { type: String },
    price: { type: Number},
    stock: { type: Number, default: 0 },
    image: { type: String },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { 
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    brand: { type: String },
    image: { type: String },
    status: { 
        type: String, 
        enum: ['INSTOCK','OUTOFSTOCK','INACTIVE'], 
        default: 'INSTOCK' 
    },
    shop: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    }, 
    price: { type: Number, default: 0},
    stock: { type: Number, default: 0 },
    variants: [variantSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'Products');

module.exports = { Product };