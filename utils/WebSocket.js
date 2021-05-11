const { http } = require('../app');
const io = require('socket.io')(http);

const webSocket = () => {
    io.on('connection', socket => {
        //Get the chatID of the user and join in a room of the same chatID
        chatID = socket.handshake.query.chatID;
        socket.join(chatID);
        console.log(`${chatID} connected`);

        //Leave the room if the user closes the socket
        socket.on('disconnect', () => {
            console.log(`${chatID} disconnected`);
            socket.leave(chatID);
        })

        //Send message to only a particular user
        socket.on('send_message', message => {
            console.log('send message fired');
            console.log(message);
            messageId = message.messageId
            receiverChatID = message.receiverChatID
            senderChatID = message.senderChatID
            content = message.content
            timestamp = message.timestamp


            //Send message to only that particular room
            console.log('Emitting receive message');
            socket.in(receiverChatID).emit('receive_message', {
                'messageId': messageId,
                'timestamp': timestamp,
                'content': content,
                'senderChatID': senderChatID,
                'receiverChatID': receiverChatID,
            })
        })
    });
}

module.exports = webSocket;