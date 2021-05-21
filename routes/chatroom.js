const express = require('express');
const router = express.Router();
const chatroomFunctions = require('../controllers/chatroom');
const userMiddlewares = require('../utils/middlewares/user');

router.get('/chatList', userMiddlewares.isLoggedIn, chatroomFunctions.getChats);
router.get('/', userMiddlewares.isLoggedIn, chatroomFunctions.getMessages);
router.post('/sendMessage', userMiddlewares.isLoggedIn, chatroomFunctions.sendMessage);
router.patch('/transferMoney', userMiddlewares.isLoggedIn, chatroomFunctions.transferAmount);
router.get('/getAdminChat', userMiddlewares.isLoggedIn, chatroomFunctions.adminChat);

module.exports = router;