const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User, Admin, Customer, Shop } = require('../models/userModel');
const { Box } = require('../models/boxModel');

const SECRET_KEY = process.env.JWT_SECRET;

exports.createUser = async (data) => {
    try {
        if (!data.role) throw new Error("Role is required");

        let Model;
        switch(data.role) {
            case 'ADMIN':
                Model = Admin;
                break;
            case 'CUSTOMER':
                Model = Customer;
                break;
            case 'SHOP':
                Model = Shop;
                break;
            default:
                throw new Error("Invalid role");
        }

        const existing = await User.findOne({ email: data.email, role: data.role, status: 'ACTIVE' });
        if (existing) {
            throw new Error(`User with email ${data.email} as ${data.role} already exists`);
        }

        const user = await Model.create(data);
        console.log("User created:", user);
        return user;

    } catch (err) {
        console.error("Error creating user:", err);
        throw err;
    }
};

exports.getUsersByRole = async (role) => {
    try {
        if (!role) throw new Error("Role parameter is required");

        const users = await User.find({ 
            role: role, 
            status: "ACTIVE" 
        }).populate('box');
        return users;

    } catch (err) {
        console.error("Error getting users by role:", err);
        throw err;
    }
};

exports.getUserById = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to get informations");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid User ID");
        }

        return await User.findById(id).populate('box');

    } catch (err) {
        console.error("Error getting users by id:", err);
        throw err;
    }
};

exports.updateUser = async (id, data) => {
    try {
        if (!id) throw new Error("One or many parameters are missing");

        return await User.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
        console.error("Error updating user:", err);
        throw err;
    }
};

exports.deleteUser = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to delete");

        return await User.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error updating user:", err);
        throw err;
    }
};

exports.loginUser = async (data) => {
    try{
        const user = await User.findOne({ email: data.email, role: data.role, status: 'ACTIVE' }).populate('box');
        if (!user) return null;

        const isValid = await user.checkPassword(data.password);
        if (!isValid) return null;

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name, role: user.role },
            SECRET_KEY,
            { expiresIn: '12h' }
        );
        return { user, token };
    } catch (err) {
        console.error("Error login user:", err);
        throw err;
    }
};

exports.me = async(id) =>{
    try {
        if (!id) throw new Error("One or many parameters are missing");

        return await User.findById(id).populate('box');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAvailableShops = async () => {
    try {
        const assignedShopIds = await Box.distinct("shop", { shop: { $ne: null } });

        const availableShops = await User.find({
            role: "SHOP",
            _id: { $nin: assignedShopIds }
        });

        return availableShops;

    } catch (err) {
        console.error("Error getting available shops:", err);
        throw err;
    }
};

exports.getMyBox = async (shopId) => {
    try {
        if (!shopId) throw new Error("Shop id parameter is required to get informations");

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            throw new Error("Invalid SHOP ID");
        }

        return await Box.findOne({ shop: shopId });

    } catch (err) {
        console.error("Error getting box by shop id:", err);
        throw err;
    }
};