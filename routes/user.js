const express = require('express');
const router = express.Router();
const userFunctions = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const userMiddlewares = require('../utils/middlewares/user');

router.post('/sendOTP', catchAsync(userMiddlewares.newUserValidity), userFunctions.sendOTP);

router.get('/resendOTP', userFunctions.sendOTP);

router.route('/register')
    .post(catchAsync(userFunctions.register));

router.route('/login')
    .post(catchAsync(userFunctions.login));

router.get('/logout', userMiddlewares.isLoggedIn, userFunctions.logout);

router.get('/sessionCheck', userFunctions.destroySession);

// router.post('/passwordResetOTP', catchAsync(userMiddlewares.userExists), catchAsync(userFunctions.sendOTP));

// router.post('/passwordReset', catchAsync(userFunctions.forgotPassword));

module.exports = router;