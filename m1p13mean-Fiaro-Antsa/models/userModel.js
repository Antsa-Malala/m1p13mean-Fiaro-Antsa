const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authPlugin = require('../plugins/authPlugin');

const options = { discriminatorKey: 'role', timestamps: true };

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['ACTIVE', 'SUSPENDED'],
        default: 'ACTIVE'
    }
}, options);

userSchema.plugin(authPlugin);

const User = mongoose.model('User', userSchema, 'Users');

const Admin = User.discriminator('ADMIN', new mongoose.Schema({}));

const Customer = User.discriminator('CUSTOMER', new mongoose.Schema({
  address: String
}));

const Shop = User.discriminator('SHOP', new mongoose.Schema({
  boxNumber: Number
}));

module.exports = { User, Admin, Customer, Shop };