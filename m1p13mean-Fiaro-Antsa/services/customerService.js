const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');

const SECRET_KEY = process.env.JWT_SECRET;

exports.createCustomer = async (data) => {
    try {
        const existingCustomer = await Customer.findOne({ mail: data.mail });

        if (existingCustomer) {
            throw new Error("Account with this email already exists");
        }
        
        const result = await Customer.create(data);
        console.log("Customer created:", result);
        return result;
    } catch (err) {
        console.error("Error on creating new account:", err);
        throw err;
    }
};


exports.getAllCustomers = async () => {
    return await Customer.find();
};

exports.getCustomerById = async (id) => {
    return await Customer.findById(id);
};

exports.updateCustomer = async (id, data) => {
    return await Customer.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCustomer = async (id) => {
    return await Customer.findByIdAndDelete(id);
};

exports.loginCustomer = async (mail, password) => {
    const customer = await Customer.findOne({ mail });
    if (!customer) return null;

    const isValid = await customer.checkPassword(password);
    if (!isValid) return null;

    const token = jwt.sign(
        { id: customer._id, mail: customer.mail, profile : "CUSTOMER" },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    return { customer, token };
};
