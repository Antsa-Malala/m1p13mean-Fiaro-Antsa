const jwt = require('jsonwebtoken');
const Shop = require('../models/shopModel');

const SECRET_KEY = process.env.JWT_SECRET;

exports.createShop = async (data) => {
    try {
        const existingShop = await Shop.findOne({ name: data.name });

        if (existingShop) {
            throw new Error("Shop with this name already exists");
        }

        const result = await Shop.create(data);
        return result;
    } catch (err) {
        console.error("Error on creating Shop account: ", err);
        throw err;
    }
};


exports.getAllShops = async () => {
    return await Shop.find();
};

exports.getShopById = async (id) => {
    return await Shop.findById(id);
};

exports.updateShop = async (id, data) => {
    return await Shop.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteShop = async (id) => {
    return await Shop.findByIdAndDelete(id);
};

exports.loginShop = async (name, password) => {
    const shop = await Shop.findOne({ name });
    if (!shop) return null;

    const isValid = await shop.checkPassword(password);
    if (!isValid) return null;

    const token = jwt.sign(
        { id: shop._id, name: shop.name, profile : "SHOP" },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    return { shop, token };
};
