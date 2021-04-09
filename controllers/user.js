const User = require('../models/user');
const cryptoRandomString = require('crypto-random-string');


module.exports.register = async (req, res) => {
    const { username, phone, password, referral } = req.body;
    const user = await User.findOne({
        $or: [
            { username },
            { phone }
        ]
    })
    if (user) {
        return res.send('User Exists');
    }
    const refUser = await User.findOne({ referral });
    if (!refUser) {
        return res.send('Invalid Referral Code');
    }
    // refuser benefits;
    const otp = await cryptoRandomString({ length: 6, type: 'numeric' });

    const newUser = new User({ username, phone, password });
    await newUser.save();
    res.session.user_id = newUser._id;
    res.send('Registration Succesful');
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        return res.send('Logged in');
    }
    res.send('Invalid Credentials');
}

module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.send('Logged out');
}

