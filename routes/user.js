const express = require('express');
const router = express.Router();
const userFunctions = require('../controllers/user');
const paymentFunctions = require('../controllers/payments');
const userMiddlewares = require('../utils/middlewares/user');
const productMiddlewares = require('../utils/middlewares/product');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

const upload = multer({ storage });

router.post('/sendOTP', userMiddlewares.newUserValidity, userFunctions.sendOTP);
router.get('/resendOTP', userFunctions.sendOTP);
router.post('/passwordResetOTP', userMiddlewares.userExists, userFunctions.sendOTP);
// router.post('/validity', userMiddlewares.newUserValidity);
// router.post('/exists', userMiddlewares.userExists);

router.post('/register', userFunctions.register);
router.get('/cancelRegistration', (req, res) => { 
    req.session.destroy();
    res.status(200).json({ status: 'ok', msg: 'Registration cancelled' }) 
});
router.post('/login', userFunctions.login);
router.get('/logout', userMiddlewares.isLoggedIn, userFunctions.logout);
router.patch('/passwordReset', userFunctions.resetPassword);

router.get('/isLoggedIn', (req, res) => {
    if (req.session && req.session.user_id)
        return res.json({ status: true });
    res.json({ status: false });
})

router.route('/userData')
    .get(userMiddlewares.isLoggedIn, userFunctions.userData)
    .patch(userMiddlewares.isLoggedIn, upload.single('profileImg'), userFunctions.updateProfile);
    
router.get('/myProducts', userMiddlewares.isLoggedIn, userFunctions.userProducts);
router.get('/wishlist', userMiddlewares.isLoggedIn, userFunctions.userWishlist);
router.get('/activityLog', userMiddlewares.isLoggedIn, userFunctions.userActivity);

router.get('/favourites/add', userMiddlewares.isLoggedIn, productMiddlewares.productExists, userFunctions.addToFavs);
router.get('/favourites/remove', userMiddlewares.isLoggedIn, userFunctions.removeFromFavs);

router.get('/order', userMiddlewares.isLoggedIn, paymentFunctions.getOrder);
router.post('/captureSubscription', paymentFunctions.catchSubscription);
router.post('/captureWallet', paymentFunctions.catchWallet);

module.exports = router;