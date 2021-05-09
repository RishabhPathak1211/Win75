const User = require('../../models/user');
const ExpressError = require('../ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        return next(new ExpressError('Not logged in', 403));
    }
    next();
}

module.exports.newUserValidity = async (req, res, next) => {
    const { username, phone, password, referral } = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { username },
                { phone }
            ]
        });
    
        if (user) {
            return next(new ExpressError('User already exists', 403));
        }

        if (referral) {
            const refUser = await User.findOne({ referral });
            if (!refUser) {
                return next(new ExpressError('Invalid referral code', 404));
            }
            req.session.refUser = refUser;
        }

        req.session.username = username;
        req.session.phone = phone;
        req.session.password = password;

        return next();
    } catch (e) {
        next(new ExpressError('Something went wrong', 500));
    }
}

// module.exports.userExists = async (req, res, next) => {
//     try {
//         const { username, phone } = req.body;
//         const user = await User.findOne({
//             $and: [
//                 { username },
//                 { phone }
//             ]
//         });
//         if (!user) {
//             return next(new ExpressError('Credential mismatch', 403));
//         }

//         req.session.username = username;
//         next();
//     } catch (e) {

//     }
// }