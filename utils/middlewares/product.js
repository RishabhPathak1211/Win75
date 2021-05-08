const Product = require('../../models/product');

module.exports.isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            if (!product.author.equals(req.session.user_id)) {
                return res.status(403).json({ 'status': false, 'msg': 'You are not authorized to do that' });
            }
        } else {
            return res.status(404).json({ 'status': false, 'msg': 'Page/Product not found' });
        }
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, msg: 'Something went wrong' });
    }
}

module.exports.validCategory = (req, res, next) => {
    const { category } = req.query;
    if (!category)
        return res.status(404).json({ status: false, msg: 'Provide a category' });
    next();
}

module.exports.productExists = async (req, res, next) => {
    try {
        const { productId } = req.query;
        console.log(productId);
        const product = await Product.findById(productId);
        console.log(product);
        if (product) return next();
        else {
            return res.status(404).json({ status: false, msg: 'Product not found' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, msg: 'Something went wrong' });
    }
}