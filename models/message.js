const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/crypt');

const MessageSchema = new mongoose.Schema({
    iv: String,
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

MessageSchema.pre('save', function (next) {
    try {
        if (!this.isModified('content')) return next();
        const encrypted = encrypt(this.content);
        this.iv = encrypted.iv;
        this.content = encrypted.content;
        return next();
    } catch (e) {
        next(e);
    }
});

MessageSchema.statics.findAndDecrypt = async function (user1, user2) {
    const messageList = await this.find({ $or: [
                                            { sender: user1, receiver: user2 },
                                            { sender: user2, receiver: user1 }
                                        ] }).sort({ timestamp: 'asc' });

    const messages = messageList.map((doc) => {
        doc.content = decrypt(doc.content, doc.iv);
        return (({ _id, content, sender, receiver, timestamp }) => ({ _id, content, sender, receiver, timestamp }))(doc);
    });

    return messages;
}

module.exports = mongoose.model('Message', MessageSchema);