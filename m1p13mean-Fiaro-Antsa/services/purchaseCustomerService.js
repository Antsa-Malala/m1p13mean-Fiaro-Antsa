const mongoose = require('mongoose');
const { Purchase, PurchaseCustomer } = require('../models/purchaseCustomerModel');
const { User } = require('../models/userModel');
const { Product } = require('../models/productModel');

exports.addPurchaseCustomer = async (data) => {
    try {
        const customerId = data.customer;
        const customer = await User.findById(customerId);
        if(!mongoose.Types.ObjectId.isValid(customerId) || !customer) {
            throw new Error('Invalid customer id or customer not found');
        }

        const validateDetails = [];
        let totalPriceGlobal = 0;

        for(const item of data.detailsPurchase) {
            const productId = item.productId;
            const product = await Product.findById(productId);
            if(!mongoose.Types.ObjectId.isValid(productId) || !product) {
                throw new Error('Invalid product id or product not found')
            }

            const variant = product.variants.id(item.variantId);
            if(!variant) {
                throw new Error('Variant not found');
            }
            if(variant.stock < item.quantity || item.quantity <= 0) {
                throw new Error('Invalid quantiy');
            }
            
            const quantity = item.quantity;
            const totalPrice = variant.price * quantity;
            validateDetails.push({
                productId: productId,
                variantId: item.variantId,
                quantity: quantity,   
                totalPrice: totalPrice
            });

            totalPriceGlobal = totalPriceGlobal + totalPrice;
        }

        const purchase = await PurchaseCustomer.create({
            customer: customerId,
            detailsPurchase: validateDetails,
            totalPriceGlobal: totalPriceGlobal
        });
        console.log("PurchaseCustomer added:", purchase);
        return purchase;


    } catch (error) {
        console.log("Error creating purchaseCustomer");
        throw error;
    }
}
