const Product = require('../../models/product');

module.exports.isAuthor = async (req, res, next) => {
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
}