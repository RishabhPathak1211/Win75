const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');

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
        console.log('entered')
        const product = new Product(req.body);
        product.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.author = req.session.user_id;
        await product.save();
        return res.status(200).json({ 'status': true, product });
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

module.exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(200).json({ 'status': true, 'msg': 'Product deleted successfully' });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.homeProducts = async (req, res, next) => {
    try {
        const carouselProds = await Product.find({ advertisement: 2 });
        const gridProds = await Product.find({ advertisement: { $ne: 2 } })
                                        .sort({ advertisement: -1, created: 1 });
        return res.status(200).json({ status: 'ok', carouselProds, gridProds });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.searchProducts = async (req, res, next) => {
    try {
        const { category, q } = req.query;
        if (!category) return next(new ExpressError('Provide a category', 404));
        if (!q) {
            const products = await Product.find({ category, advertisement: { $ne: 2 } })
                                            .sort({ advertisement: -1, created: -1 });
            return res.status(200).json({ status: true, products });
        } else {
            const products = await Product.find({ category, $text: { $search: q } });
            return res.status(200).json({ status: true, products });
        }
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}