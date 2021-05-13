const Product = require('../../models/product');
const ExpressError = require('../ExpressError');

module.exports.isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            if (!product.author.equals(req.session.user_id)) {
                return res.status(403).json({ 'status': false, 'msg': 'You are not authorized to do that' });
            }
        } else {
            return next(new ExpressError('Product not found', 404));
        }
        return next();
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.validCategory = (req, res, next) => {
    const { category } = req.query;
    if (!category)
        return next(new ExpressError('Provide a valid category', 404));
    next();
}

module.exports.productExists = async (req, res, next) => {
    try {
        const { productId } = req.query;
        const product = await Product.findById(productId);
        if (product) return next();
        else {
            return next(new ExpressError('Product not found', 404));
        }
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}