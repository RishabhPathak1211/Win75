module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        res.send('Not logged in');
    }
    next();
}

module.exports.generateOTP = (req, res, next) => {
    const { username, phone, password, referral } = req.body;
    const user = await User.findOne({
        $or: [
            { username },
            { phone }
        ]
    })
    if (user) {
        return res.send('User already exists');
    }
    const refUser = await User.findOne({ referral });
    if (!refUser) {
        return res.send('Invalid Referral Code');
    }
    // refuser benefits;
    const otp = await cryptoRandomString({ length: 6, type: 'numeric' });
    console.log(otp);
    req.username = username;
    req.phone = phone;
    req.password = password;
    req.otp = otp;
    next();
}