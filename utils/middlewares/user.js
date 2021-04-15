const User = require('../../models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        return res.status(403).json({ 'status': false, 'msg': 'Not logged in' });
    }
    next();
}

module.exports.newUserValidity = async (req, res, next) => {
    const { username, phone, password, referral } = req.body;
    console.log({ username, phone, password });
    const user = await User.findOne({
        $or: [
            { username },
            { phone }
        ]
    })
    if (user) {
        return res.status(403).json({ 'status': false, 'msg': 'User already exists' });
    }

    if (referral) {
        const refUser = await User.findOne({ referral });
        if (!refUser) {
            return res.status(403).json({ 'status': false, 'msg': 'Invalid referral code' });
        }
        req.session.refUser = refUser;
    }

    req.session.username = username;
    req.session.phone = phone;
    req.session.password = password;

    console.log(req.session);

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
        return res.status(403).json({ 'status': false, 'msg': 'Credential mismatch' });
    }

    req.session.username = username;
    next();
}