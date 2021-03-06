const Chatroom = require('../models/chatroom');
const Message = require('../models/message');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const { decrypt } = require('../utils/crypt');
const chatroom = require('../models/chatroom');

module.exports.getChats = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.session.user_id, { username: 1 });
        const chatrooms = await Chatroom.find({ participants: { $in: [req.session.user_id] } })
                                        .populate('participants', '_id username')
                                        .populate('lastMessage');

        if (!chatrooms) {
            return res.status(200).json({ status: 'ok', currentUser, chatList: [] });
        }

        if (currentUser.username !== 'BetterDeal') {
            const admin = await User.findOne({ username: 'BetterDeal'}, { username: 1 });
            const adminChat = await Chatroom.findOne({ participants: [ admin._id, req.session.user_id ] })
                                            .populate('participants', '_id username')
                                            .populate('lastMessage');
            let index = 0;
            for (let cr of chatrooms) {
                if (cr.participants[0].username === 'BetterDeal')
                    index = chatrooms.indexOf(cr)
            }
            console.log(index);
            if (index > -1)
                chatrooms.splice(index, 1);
        }

        const chatList = chatrooms.map((doc) => {
            doc.lastMessage.content = decrypt(doc.lastMessage.content, doc.lastMessage.iv);
            return {
                user: doc.participants[0]._id == req.session.user_id ? { _id: doc.participants[1]._id, username: doc.participants[1].username } : { _id: doc.participants[0]._id, username: doc.participants[0].username },
                lastMessage: (({ _id, content, sender, receiver, timestamp }) => ({ _id, content, sender, receiver, timestamp }))(doc.lastMessage)
            }
        });

        chatList.sort((a, b) => {
            return b.lastMessage.timestamp - a.lastMessage.timestamp;
        });

        return res.status(200).json({ status: 'ok', currentUser, chatList });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.getMessages = async (req, res, next) => {
    try {
        const { id } = req.query;
        const messages = await Message.findAndDecrypt(req.session.user_id, id);
        return res.status(200).json({ status: 'ok', messages });
    } catch (e) {
        if (e.message.indexOf('Cast to ObjectId') !== -1)
            return next(new ExpressError('Invalid chat ID', 404))
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.sendMessage = async (req, res, next) => {
    try {
        const { receiver, content } = req.body;
        console.log(req.body);
        if (!receiver)
            return next(new ExpressError('Please provide receiver ID', 404));
        if (!content)
            return next(new ExpressError('Please provide message content', 403));
        const message = new Message({ ...req.body, sender: req.session.user_id});
        await message.save();
        const chatroom = await Chatroom.findOneAndUpdate({ 
                                                participants: { 
                                                    $size: 2, $all: [
                                                        req.session.user_id,
                                                        receiver
                                                    ] 
                                                } }, {
                                                    lastMessage: message
                                                }, {
                                                    new: true
                                                });
        if (!chatroom) {
            const newChatroom = new Chatroom({ participants: [ req.session.user_id, receiver ], lastMessage: message });
            await newChatroom.save();
        }
        res.status(200).json({ status: 'ok', message });
    } catch (e) {
        if (e.message.indexOf('Cast to ObjectId') !== -1)
            return next(new ExpressError('Invalid receiver ID', 404));
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.transferAmount = async (req, res, next) => {
    try {
        const { senderid, receiverid, amount } = req.body;
        const sender = await User.findById(senderid).select('wallet');
        if (sender.wallet < amount)
            return next(new ExpressError('Insufficient balance', 403));
        await User.findByIdAndUpdate(senderid, { $inc: { wallet: -amount } });
        await User.findByIdAndUpdate(receiverid, { $inc: { wallet: amount } });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}

module.exports.adminChat = async ( req, res, next ) => {
    try {
        const currentUser = await User.findById(req.session.user_id, { username: 1 });
        const admin = await User.findOne({ username: 'BetterDeal' });
        let adminChat = await Chatroom.findOne({ participants: [ admin._id, req.session.user_id ] }, { participants: 0 })
                                        .populate('lastMessage');
        adminChat.lastMessage.content = decrypt(adminChat.lastMessage.content, adminChat.lastMessage.iv);
        return res.status(200).json({ status: 'ok', currentUser, adminChat });
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
}