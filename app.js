const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const chatroomRoutes = require('./routes/chatroom');
// const webSocket = require('./utils/WebSocket');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

const app = express();
const httpServer = http.createServer(app);

app.use('/healthCheck', (req, res) => {
    res.status('OK');
})
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: MongoDBStore.create({
        mongoUrl: dbUrl
    }),
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
    }
}));
app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/chatroom', chatroomRoutes);
app.get('/', (req, res) => {
    res.status(200).send('OK');
})

app.use((err, req, res, next) => {
    const { statusCode, message, stack } = err;
    console.log('Error: ' + stack);
    res.status(statusCode).json({ status: false, msg: message });
});

// app.use('/', (req, res) => {
//     // console.log(req.headers);
//     // console.log(res);
//     console.log(res.req.session);
//     console.log(res.req.sessionID);
//     // console.log(res['headers']);
//     // console.log(res.req.headers);
//     res.send(req.headers);
// })

module.exports = { httpServer, db };