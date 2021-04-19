const Product = require('../models/product');

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        product.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.author = req.session.user_id;
        await product.save();
        res.status(200).json({ 'status': true, 'msg': 'Product created successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ 'status': false, 'msg': 'Something went wrong' });
    }
};