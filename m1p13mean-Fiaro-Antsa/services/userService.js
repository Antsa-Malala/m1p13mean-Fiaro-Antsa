const jwt = require('jsonwebtoken');
const { User, Admin, Customer, Shop } = require('../models/userModel');

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

        const users = await User.find({ role });
        return users;

    } catch (err) {
        console.error("Error getting users by role:", err);
        throw err;
    }
};

exports.getUserById = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to get informations");

        return await User.findById(id);

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
        const user = await User.findOne({ email: data.email, role: data.role, status: 'ACTIVE' });
        if (!user) return null;

        const isValid = await user.checkPassword(data.password);
        if (!isValid) return null;

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return { user, token };
    } catch (err) {
        console.error("Error login user:", err);
        throw err;
    }
};
