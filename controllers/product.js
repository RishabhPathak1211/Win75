const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');
const mongoose = require('mongoose');

module.exports.premiumProducts = async (req, res, next) => {
    const { category } = req.query;
    try {
        let products = await Product.find({ category })
                                .populate({
                                    path: 'author',
                                    match: { 
                                        premium: true,
                                        _id: { $ne: req.session.user_id }
                                    }
                                });
        products = products.filter(doc => doc.author !== null);
        return res.status(200).json({ status: true, products });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        if (req.files)
            product.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.author = req.session.user_id;
        await product.save();
        return res.status(200).json({ 'status': true, 'msg': 'Product created successfully' });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
};

module.exports.viewProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('author');
        if (product) {
            return res.status(200).json({ 'status': true, product });
        }
        return next(new ExpressError('Product not found', 404));
    } catch (e) {
        if (e.message.indexOf('Cast to ObjectId') !== -1)
            return next(new ExpressError('Invalid product ID', 404))
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!product) {
            return next(new ExpressError('Product not found', 404));
        }
        return res.status(200).json({ status: true, product });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(200).json({ 'status': true, 'msg': 'Product deleted successfully' });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.searchProducts = async (req, res, next) => {
    try {
        const { category, q } = req.query;
        console.log(q);
        const products = await Product.find({ $text: { $search: q } });
        return res.status(200).json({ status: true, products });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}