if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const { httpServer, db } = require('./app');
const webSocket = require('./utils/WebSocket');

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});

webSocket();

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
})