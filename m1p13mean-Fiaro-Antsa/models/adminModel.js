const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authPlugin = require('../plugins/authPlugin');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.plugin(authPlugin);

module.exports = mongoose.model('Admin', adminSchema, 'Admins');
