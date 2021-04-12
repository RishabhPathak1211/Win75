const User = require('../models/user');


module.exports.sendOTP = (req, res) => {
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    console.log(otp);
    req.session.otp = otp;
    res.send(otp);
}

module.exports.register = async (req, res) => {
    const { otp } = req.body;
    const { username, phone, password, referral } = req.session;

    if (otp === req.session.otp) {
        if (referral) {
            const refUser = await User.findOne({ referral });
            //  refUser benefiys goes here
        }

        const newUser = new User({ username, phone, password });
        await newUser.save();

        req.session.user_id = newUser._id;
        console.log(req.session);
        res.send('Registration Succesful');
    }
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    console.log(foundUser);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        console.log(req.session);
        return res.send('Logged in');
    }
    res.send('Invalid Credentials');
}

module.exports.logout = async (req, res) => {
    req.session.destroy();
    res.send('Logged out');
}

module.exports.forgotPassword = async (req, res) => {
    const { newpassword } = req.body;
    const foundUser = await User.findOne({ username });
    if (!foundUser)
        return res.send('User not found');
    foundUser.password = newpassword;
    await foundUser.save();
}