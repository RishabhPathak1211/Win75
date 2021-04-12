const User = require('../../models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        return res.send('Not logged in');
    }
    next();
}

module.exports.newUserValidity = async (req, res, next) => {
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

    if (referral) {
        const refUser = await User.findOne({ referral });
        if (!refUser) {
            return res.send('Invalid Referral Code');
        }
        req.session.refUser = refUser;
    }

    req.session.username = username;
    req.session.phone = phone;
    req.session.password = password;

    next();
}

module.exports.userExists = async (req, res, next) => {
    const { username, phone } = req.body;
    const user = await User.findOne({
        $and: [
            { username },
            { phone }
        ]
    });
    if (!user) {
        return res.send('User not found');
    }

    req.session.username = username;
    next();
}