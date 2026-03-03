const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const productService = require('../services/productService');
const movementStockService = require('../services/movementStockService');
const { MovementStock } = require('../models/movementStockModel');
const purchaseService = require('../services/purchaseCustomerService');
const { PurchaseCustomer } = require('../models/purchaseCustomerModel');

const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

exports.createProduct = async (req, res) => {
    try {
        let mainImageUrl = null;

        if (req.files?.image) {
            const file = req.files.image[0];

            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'products'
            });

            mainImageUrl = result.secure_url;

            fs.unlinkSync(file.path);
        }
    
        const variants = JSON.parse(req.body.variants || '[]');

        if (req.files?.variantImages) {
            const variantFiles = req.files.variantImages;

            for (let i = 0; i < variantFiles.length; i++) {
                const file = variantFiles[i];

                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products'
                });

                if (variants[i]) {
                    variants[i].image = result.secure_url;
                }

                fs.unlinkSync(file.path);
            }
        }

        const product = await productService.createProduct({
            ...req.body,
            image: mainImageUrl,
            variants: variants
        });

        res.status(201).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.shopId) 
        {
            filter.shop = req.query.shopId;
        }
        
        if (req.query.categoryId) 
        {
            filter.category = req.query.categoryId;
        }
        
        if (req.query.status) 
        {
            filter.status = req.query.status;
        }

        const products = await productService.getProducts(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Unexpected error' });
    }
};

exports.getProductsMinima = async (req, res) => {
    try {
        const filter = {};
        if (req.query.shopId) 
        {
            filter.shop = req.query.shopId;
        }

        if (req.query.categoryId) 
        {
            filter.category = req.query.categoryId;
        }
        if (req.query.status) 
        {
            filter.status = req.query.status;
        }
        
        const products = await productService.getProductsMinima(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Unexpected error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(404).json({ message: err.message || 'Product not found' });
    }
};

exports.updateProduct = async (req, res) => {
    try {

        const existingProduct = await productService.getProductById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        let updateData = { ...req.body };

        if (req.files?.image) {
            const file = req.files.image[0];

            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'products'
            });

            updateData.image = result.secure_url;

            fs.unlinkSync(file.path);
        }

        const incomingVariants = JSON.parse(req.body.variants || '[]');
        const existingVariants = existingProduct.variants || [];

        const mergedVariants = incomingVariants.map(newVariant => {

            if (newVariant._id) {

                const oldVariant = existingVariants.find(
                    v => v._id.toString() === newVariant._id
                );

                return {
                    ...newVariant,
                    image: newVariant.image || oldVariant?.image || null
                };
            }

            return newVariant;
        });

        if (req.files?.variantImages) {

            for (let i = 0; i < req.files.variantImages.length; i++) {

                const file = req.files.variantImages[i];

                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products'
                });

                if (mergedVariants[i]) {
                    mergedVariants[i].image = result.secure_url;
                }

                fs.unlinkSync(file.path);
            }
        }

        updateData.variants = mergedVariants;

        const updatedProduct = await productService.updateProduct(
            req.params.id,
            updateData,
            req.user
        );

        res.json(updatedProduct);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id, req.user);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateVariantStock = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { newStock } = req.body;
        if (newStock == null) return res.status(400).json({ message: 'New stock value is required' });
        const updatedProduct = await productService.updateVariantStock(productId, variantId, newStock, req.user);
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAvailableProducts = async (req, res) => {
    try {
        const products = await productService.getAvailableProducts(req.params?.shopId, req.params?.categoryId);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Unable to fetch products' });
    }
};

exports.deleteVariant = async (req, res) => {
    try {

        const { productId, variantId } = req.params;

        const updatedProduct = await productService.deleteVariant(productId, variantId);

        res.json(updatedProduct);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addVariantStock = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { stockToAdd } = req.body;
        const stockToAddNumber = Number(stockToAdd);
        if(isNaN(stockToAddNumber) || stockToAddNumber < 0 ) {
            throw new Error('Invalid stock value');
        }

        const variant = await productService.getVariant(productId, variantId);
        const newStock = variant.stock + stockToAddNumber;

        const updatedProduct = await productService.updateVariantStock(productId, variantId, newStock, req.user);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProductByShopId = async (req, res) => {
    try {
        const { shopId } = req.params;
        const products = await productService.getProductsByShopId(shopId);

        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getVariantsByProductId = async (req, res) => {
    try {
        const productId = req.params;
        const variants = await productService.getVariantsByProductsId(productId);

        res.json(variants);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};

exports.processCartConfirmation = async (req, res) => {
    try {
        const { purchaseList } = req.body;

        if (!Array.isArray(purchaseList) || purchaseList.length === 0) {
            throw new Error('Purchase list is required');
        }

        for (const item of purchaseList) {
            const { productId, variantId, quantity } = item;

            if (!productId || !variantId || !quantity) {
                throw new Error('Invalid purchase item');
            }

            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            const variant = await productService.getVariant(productId, variantId);
            if(variant.stock < quantity) {
                throw new Error('Insufficient quantity');
            }
        }

        for (const item of purchaseList) {
            const { productId, variantId, quantity } = item;

            const variant = await productService.getVariant(productId, variantId);
            const newStock = variant.stock - quantity;
            
            productService.updateVariantStock(productId, variantId, newStock, req.user);

            const movement = new MovementStock({
                type: 'RELEASE',
                quantity: quantity,
                product: productId,
                variant: variantId
            });
            await movementStockService.addStock(movement);
        }

        console.log("TAY " + req.user.id);
        let purchase = new PurchaseCustomer({
            customer: req.user.id,
            detailsPurchase: purchaseList,
            totalPriceGobal: 0
        });
        await purchaseService.addPurchaseCustomer(purchase);

        res.status(201).json({ message: purchase });     

    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};