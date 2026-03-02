const { Product } = require('../models/productModel');
const mongoose = require('mongoose');

exports.createProduct = async (data) => {
    try {
        const existing = await Product.findOne({ name: data.name, user: data.shop });
        if (existing) {
            throw new Error(`Product with name ${data.name} already exists in your shop`);
        }

        const product = await Product.create(data);
        console.log("Product created:", product);
        return product;

    } catch (err) {
        console.error("Error creating product:", err);
        throw err;
    }
};

exports.getProducts = async (filter = {}) => {
    return await Product.find(filter)
        .populate('shop')
        .populate('category');
};

exports.getProductsMinima = async (filter = {}) => {
    return await Product.find(filter)
        .select('_id name brand category image status shop stock price')
        .populate('category', 'name')
        .populate('shop', 'name');
};

exports.getProductById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) 
    {
        throw new Error('Invalid product id');
    }

    const product = await Product.findById(id)
        .populate('shop')
        .populate('category');

    if (!product) 
    {
        throw new Error('Product not found');
    }
    return product;
};

exports.updateProduct = async (id, data, user) => {
    try {
        if (!id) throw new Error("Missing ID");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product id');
        }

        const existing = await Product.findOne({ name: data.name, user: data.shop, _id: { $ne: id } });
        if (existing) {
            throw new Error(`Product with name ${data.name} already exists in your shop`);
        }

        if (data.status === "OUTOFSTOCK" || data.status === "INACTIVE") {
            data.stock = 0;

            if (data.variants && data.variants.length) {
                data.variants = data.variants.map(v => ({
                    ...v,
                    stock: 0
                }));
            }
        }

        const product = await Product.findById(id);

        if (!product) {
            throw new Error('Product not found');
        }
        
        const isAdmin = user?.role === 'ADMIN';
        console.log(isAdmin); 
        console.log(product.shop._id.toString()); 
        console.log(user.id); 
        if (!isAdmin && (product.shop._id.toString() !== user?.id)) {
            throw new Error('You are not allowed to update this product');
        }

        return await Product.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
        console.error("Error updating product:", err);
        throw err;
    }
};

exports.deleteProduct = async (id, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product id');
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }

    const isAdmin = user?.role === 'ADMIN';
   if (!isAdmin && (product.shop._id.toString() !== user?.id)) {
        throw new Error('You are not allowed to delete this product');
    }

    return await Product.findByIdAndDelete(id);
};

exports.deleteVariant = async (productId, variantId) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $pull: { variants: { _id: variantId } } },
        { new: true }
    );

    if (!updatedProduct) {
        throw new Error('Product not found');
    }

    let totalStock = 0;
    let minPrice = updatedProduct.price;

    if (updatedProduct.variants && updatedProduct.variants.length) {
        totalStock = updatedProduct.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        minPrice = Math.min(...updatedProduct.variants.map(v => v.price || Infinity));
    }

    updatedProduct.stock = totalStock;
    if (updatedProduct.variants && updatedProduct.variants.length) {
        updatedProduct.price = minPrice;
    }

    await updatedProduct.save();

    return updatedProduct;
};

exports.getVariant = async (productId, variantId, user) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product id');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const isAdmin = user?.role === 'ADMIN';

    if (!isAdmin && (product.shop._id.toString() !== user?.id)) {
         throw new Error('You are not allowed to update this product variant');
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    return variant;
};

exports.updateVariantStock = async (productId, variantId, newStock, user) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product id');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    const isAdmin = user?.role === 'ADMIN';

    if (!isAdmin && (product.shop._id.toString() !== user?.id)) {
        throw new Error('You are not allowed to update this product variant');
    }

    const variant = product.variants.find(v => v._id === variantId);
    if (!variant) {
        throw new Error('Variant not found');
    }

    variant.stock = newStock;
    return await product.save();
};

exports.getAvailableProducts = async (shopId, categoryId) => {
    const filter = { status: 'INSTOCK' };
    if (shopId) 
    {
        filter.shop = shopId;
    }
    
    if (categoryId) 
    {
        filter.category = categoryId;
    }

    return await this.getProducts(filter);
};

exports.getProductsByShopId = async (shopId) => {
    const filter = {};
    filter.shop = shopId;
    const result = await this.getProductsMinima(filter);
    if(!result) {
        throw new Error('No products for your shop');
    }

    return result;
};

exports.getVariantsByProductsId = async (productId) => {
    const products = await Product
                            .findById(productId)
                            .select('variants');

    return products.variants;
};