const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authPlugin = require('../plugins/authPlugin');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

shopSchema.plugin(authPlugin);

module.exports = mongoose.model('Shop', shopSchema, 'Shops');
