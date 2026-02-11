const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const SECRET_KEY = process.env.JWT_SECRET;

exports.createAdmin = async (data) => {
    try {
        const existingAdmin = await Admin.findOne({ name: data.name });

        if (existingAdmin) {
            throw new Error("Admin with this name already exists");
        }

        const result = await Admin.create(data);
        return result;
    } catch (err) {
        console.error("Error on creating Admin account: ", err);
        throw err;
    }
};


exports.getAllAdmins = async () => {
    return await Admin.find();
};

exports.getAdminById = async (id) => {
    return await Admin.findById(id);
};

exports.updateAdmin = async (id, data) => {
    return await Admin.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteAdmin = async (id) => {
    return await Admin.findByIdAndDelete(id);
};

exports.loginAdmin = async (name, password) => {
    const admin = await Admin.findOne({ name });
    if (!admin) return null;

    const isValid = await admin.checkPassword(password);
    if (!isValid) return null;

    const token = jwt.sign(
        { id: admin._id, name: admin.name, profile : "ADMIN" },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    return { admin, token };
};
