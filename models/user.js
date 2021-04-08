const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    phone: {
        type: String,
        required: [true, 'Phone number cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    referral: {
        type: String
    }
});

UserSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({ username });
    if (foundUser) {
        const isValid = await bcrypt.compare(password, foundUser.password);
        if (isValid) return true;
    }
    return false;
};

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    let tmpReferral = await cryptoRandomString({ length: 10 });
    let exists = await this.findOne({ referral: tmpReferral });
    while (exists) {
        let tmpReferral = await cryptoRandomString({ length: 10 });
        let exists = await this.findOne({ referral: tmpReferral });
    }
    this.referral = tmpReferral;
    next();
});

module.exports = mongoose.model('User', UserSchema);