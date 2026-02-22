const bcrypt = require('bcrypt');

module.exports = function authPlugin(schema) {

    schema.pre('save', async function () {
        if (!this.isModified('password')) return;
        this.password = await bcrypt.hash(this.password, 10);
    });

    schema.methods.checkPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };
};
