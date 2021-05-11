const express = require('express');
const router = express.Router();
const userFunctions = require('../controllers/user');
const userMiddlewares = require('../utils/middlewares/user');
const productMiddlewares = require('../utils/middlewares/product');

router.post('/sendOTP', userMiddlewares.newUserValidity, userFunctions.sendOTP);

router.get('/resendOTP', userFunctions.sendOTP);

router.route('/register')
    .post(userFunctions.register);

router.get('/cancelRegistration', (req, res) => { req.session.destroy() });

router.route('/login')
    .post(userFunctions.login);

router.get('/logout', userMiddlewares.isLoggedIn, userFunctions.logout);

router.get('/userData', userMiddlewares.isLoggedIn, userFunctions.userData);

// router.post('/passwordResetOTP', catchAsync(userMiddlewares.userExists), catchAsync(userFunctions.sendOTP));

// router.post('/passwordReset', catchAsync(userFunctions.forgotPassword));

router.get('/favourites/add', userMiddlewares.isLoggedIn, productMiddlewares.productExists, userFunctions.addToFavs);
router.get('/favourites/remove', userMiddlewares.isLoggedIn, userFunctions.removeFromFavs);

module.exports = router;