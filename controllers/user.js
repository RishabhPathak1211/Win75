const User = require('../models/user');
const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../utils/cloudinary');
const nexmo = require('../utils/nexmo');

module.exports.sendOTP = async (req, res, next) => {
    try {
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
        req.session.otp = otp;
        const response = await nexmo.message.sendSms(process.env.NEXMO_FROM_ADDRESS, '+91 91639 69400', `Your verification code is ${otp}`);
        // console.log(response);
        res.status(200).json({ status: 'ok', msg: 'OTP sent' });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.register = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const { username, phone, password, referral } = req.session;
        if (otp === req.session.otp) {
            if (referral) {
                await User.findOneAndUpdate({ referral }, { $inc: { wallet: 50 } }, { new: true });
            }
            const newUser = new User({ username, phone, password });
            await newUser.save();

            delete req.session.username;
            delete req.session.phone;
            delete req.session.password;
            delete req.session.referral;
            delete req.session.otp;

            req.session.user_id = newUser._id;
            return res.status(200).json({ 'status': true, 'msg': 'Registration Succesful' });
        }
        return next(new ExpressError('OTP Mismatch', 403));
    } catch (e) {
        req.session.destroy();
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findAndValidate(username, password);
        if (foundUser) {
            req.session.user_id = foundUser._id;
            return res.status(200).json({ 'status': true, 'msg': 'Logged in' });
        }
        return next(new ExpressError('Invalid credentials', 403));
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.logout = (req, res) => {
    req.session.destroy();
    res.status(200).json({ 'status': true, 'msg': 'Logged out' });
}

module.exports.resetPassword = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const { phone, password } = req.session;
        if (otp === req.session.otp) {
            const user = await User.findOne({ phone });
            if (!user) return next(new ExpressError('User not found', 403));
            user.password = password;
            await user.save();

            delete req.session.phone;
            delete req.session.password;

            return res.status(200).json({ status: 'ok', msg: 'Password reset successful' });
        }
        return next(new ExpressError('OTP mismatch', 403));
    } catch (e) {
        req.session.destroy();
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.updateProfile = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await User.findByIdAndUpdate(req.session.user_id, { email }, { new: true });
            return res.status(200).json({ status: 'ok', user });
        } else if (req.file) {
            const { profileImg } = await User.findById(req.session.user_id)
                                                .select('profileImg');
            if (profileImg) await cloudinary.uploader.destroy(profileImg.filename);
            const user = await User.findByIdAndUpdate(req.session.user_id, { 
                                                                profileImg: { 
                                                                    url: req.file.path, filename: req.file.filename 
                                                                } 
                                                            }, { new: true });
            return res.status(200).json({ status: 'ok', user });
        }
        
        return next(new ExpressError('Provide a field', 403));
    } catch(e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.userData = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user_id)
                                .select('-myProducts -favProducts -password');
        return res.status(200).json({ status: true, user });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.userProducts = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user_id)
                                        .select('myProducts')
                                        .populate('myProducts', '-advertisement');
        return res.status(200).json({ status: true, myProducts: user.myProducts });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.userWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user_id)
                                        .select('favProducts')
                                        .populate('favProducts', '-advertisement');
        return res.status(200).json({ status: true, favProducts: user.favProducts });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.userActivity = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user_id)
                                .select('activityLog')
                                .populate('activityLog.product');
        return res.status(200).json({ status: true, activityLog: user.activityLog });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}
 
// module.exports.forgotPassword = async (req, res) => {
//     const { newpassword } = req.body;
//     const foundUser = await User.findOne({ username });
//     if (!foundUser)
//         return res.send('User not found');
//     foundUser.password = newpassword;
//     await foundUser.save();
// }

module.exports.addToFavs = async (req, res, next) => {
    try {
        const { productId } = req.query;
        const user = await User.findById(req.session.user_id);
        user.favProducts.push(productId);
        user.activityLog.push({ product: productId, activityType: 'Added to wishlist' });
        await user.save();
        return res.status(200).json({ status: true, msg: 'Product added to favourites' });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.removeFromFavs = async (req, res, next) => {
    try {
        const { productId } = req.query;
        const user = await User.findById(req.session.user_id);
        const index = user.favProducts.indexOf(productId);
        if (index > -1) {
            user.favProducts.splice(index);
            user.activityLog.push({ product: productId, activityType: 'Removed from wishlist' });
            await user.save();
            return res.status(200).json({ status: true, msg: 'Product removed from favourites' });
        } else {
            return next(new ExpressError('Product not found in list', 403));
        }
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}