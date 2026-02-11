const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authPlugin = require('../plugins/authPlugin');

const customerSchema = new mongoose.Schema({
    mail: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

customerSchema.plugin(authPlugin);

module.exports = mongoose.model('Customer', customerSchema, 'Customers');
