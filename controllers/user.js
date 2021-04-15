const User = require('../models/user');


module.exports.sendOTP = (req, res) => {
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    console.log(otp);
    req.session.otp = otp;
    res.status(200).json({ 'otp': otp});
}

module.exports.register = async (req, res) => {
    const { otp } = req.body;
    console.log(req.session);
    const { username, phone, password, referral } = req.session;

    console.log({ username, phone, password });

    if (otp === req.session.otp) {
        if (referral) {
            const refUser = await User.findOne({ referral });
            //  refUser benefiys goes here
        }

        const newUser = new User({ username, phone, password });
        await newUser.save();

        req.session.username = null;
        req.session.phone = null;
        req.session.password = null;
        req.session.otp = null;

        req.session.user_id = newUser._id;
        console.log(req.session);
        return res.status(200).json({ 'status': true, 'msg': 'Registration Succesful' });
    }
    res.status(403).json({ 'status': false, 'msg': 'OTP mismatch' });
}

module.exports.destroySession = (req, res) => {
    if (!req.session.user_id) {
        req.session.destroy();
        return res.send('Session detroyed');
    }
    res.send('user id exists');
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    console.log(foundUser);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        console.log(req.session);
        return res.status(200).json({ 'status': true, 'msg': 'Logged in' });
    }
    res.status(403).json({ 'status': true, 'msg': 'Invalid credentials' });
}

module.exports.logout = (req, res) => {
    req.session.destroy();
    res.status(200).json({ 'status': true, 'msg': 'Logged out' });
}

module.exports.forgotPassword = async (req, res) => {
    const { newpassword } = req.body;
    const foundUser = await User.findOne({ username });
    if (!foundUser)
        return res.send('User not found');
    foundUser.password = newpassword;
    await foundUser.save();
}