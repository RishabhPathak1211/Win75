const Product = require('../models/product');

module.exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        product.imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.author = req.session.user_id;
        await product.save();
        return res.status(200).json({ 'status': true, 'msg': 'Product created successfully' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ 'status': false, 'msg': 'Something went wrong' });
    }
};

module.exports.viewProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            return res.status(200).json({ 'status': true, 'msg': 'Product found', 'product': product });
        }
        return res.status(404).json({ 'status': false, 'msg': 'Page not found' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ 'status': false, 'msg': 'Something went wrong' });
    }
}

module.exports.updateProduct = async (req, res) => {

}

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(200).json({ 'status': true, 'msg': 'Product deleted successfully' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ 'status': false, 'msg': 'Something went wrong' });
    }
}