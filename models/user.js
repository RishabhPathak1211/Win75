const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    wallet: {
        type: Number,
        default: 500
    },
    referral: {
        type: String
    },
    premium: {
        type: Boolean,
        default: false
    },
    myProducts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Product'
    },
    favProducts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Product'
    }
});

UserSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({ username });
    if (foundUser) {
        console.log('found a user');
        const isValid = await bcrypt.compare(password, foundUser.password);
        if (isValid) 
            return foundUser;
    }
    return undefined;
};

UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) 
            return next();

        this.password = await bcrypt.hash(this.password, 12);
        if (!this.referral) {
            let tmpReferral = crypto.randomBytes(10).toString('hex');
            console.log(this);
            let exists = await this.model('User').findOne({ referral: tmpReferral });
            while (exists) {
                tmpReferral = crypto.randomBytes(10).toString('hex');
                exists = await this.findOne({ referral: tmpReferral });
            }
            this.referral = tmpReferral;
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);