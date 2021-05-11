const mongoose = require('mongoose');

const ChatroomSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        validate: [size, 'Invalid length']
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
});

function size (val) {
    return val.length === 2;
}

module.exports = mongoose.model('Chatroom', ChatroomSchema);