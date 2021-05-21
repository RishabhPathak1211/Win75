const rpinstance = require('../utils/razorpay');
const User = require('../models/user');
const crypto = require('crypto');
const ExpressError = require('../utils/ExpressError');

module.exports.getOrder = (req, res, next) => {
    try {
        if (req.query.amount) req.session.amount = amount;
        var options = {  
            amount: req.query.amount || 500,
            currency: "INR", 
        };
        rpinstance.orders.create(options, function(err, order) {
            req.session.order_id = order.id;
            res.status(200).json(order);
        });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
};

module.exports.catchSubscription = async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        if (razorpay_payment_id) {
            const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_API_KEY_SECRET)
                                            .update(req.session.order_id + "|" + razorpay_payment_id)
                                           .digest('hex');
            if (generated_signature === razorpay_signature) {
                await User.findOneAndUpdate(req.session.user_id, { premium: true });
                return res.status(200).json({ status: 'ok', msg: 'Subscription successful' });
            } else {
                next(new ExpressError('Invalid payment', 403));
            }
        } else {
            next(new ExpressError('Something went wrong', 500))
        }
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.catchWallet = async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        if (razorpay_payment_id) {
            const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_API_KEY_SECRET)
                                            .update(req.session.order_id + "|" + razorpay_payment_id)
                                           .digest('hex');
            if (generated_signature === razorpay_signature) {
                await User.findOneAndUpdate(req.session.user_id, { $inc: { wallet: req.session.amount } });
                delete req.session.amount;
                return res.status(200).json({ status: 'ok', msg: 'Subscription successful' });
            } else {
                delete req.session.amount;
                next(new ExpressError('Invalid payment', 403));
            }
        } else {
            delete req.session.amount;
            next(new ExpressError('Something went wrong', 500))
        }
    } catch (e) {
        delete req.session.amount;
        next(new ExpressError('Something went wrong', 500, e));
    }
}