const express = require('express');
const router = express.Router();
const userMiddlewares = require('../utils/middlewares/user');
const productMiddlewares = require('../utils/middlewares/product');
const productFunctions = require('../controllers/product');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/new', userMiddlewares.isLoggedIn, upload.array('images', 5), productFunctions.createProduct);

router.get('/premium', productFunctions.premiumProducts);

router.get('/search', productFunctions.searchProducts);

router.route('/:id')
    .get(productFunctions.viewProduct)
    .patch(userMiddlewares.isLoggedIn, productMiddlewares.isAuthor, productFunctions.updateProduct)
    .delete(userMiddlewares.isLoggedIn, productMiddlewares.isAuthor, productFunctions.deleteProduct);

// router.get('/delete/:id', userMiddlewares.isLoggedIn, productMiddlewares.isAuthor, productFunctions.deleteProduct);

module.exports = router;