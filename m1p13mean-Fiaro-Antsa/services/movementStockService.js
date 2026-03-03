const { MovementStock } = require('../models/movementStockModel');
const { Product } = require('../models/productModel');
const mongoose = require('mongoose');

exports.addStock = async (data) => {
    try {
        if(!data.movementDate || isNaN(new Date(data.movementDate).getTime())) {
            throw new Error('Movemement date invalid');
        }
        if(data.quantity < 1) {
            throw new Error('Quantity invalid');
        }

        const product = await Product.findById(data.product);
        if(!product) {
            throw new Error('Product not found');
        }

        const variant = product.variants.id(data.variant);
        if(!variant) {
            throw new Error('Variant not found in this product');
        }
        
        const movementStock = await MovementStock.create(data);
        console.log("MovementStock added:", movementStock);

        return movementStock;
        
    } catch (err) {
        throw err;
    }
};