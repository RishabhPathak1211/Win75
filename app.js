const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

const app = express();

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
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    }
}));

app.use('/user', userRoutes);
app.use('/product', productRoutes);

// app.use('/', (req, res) => {
//     // console.log(req.headers);
//     // console.log(res);
//     console.log(res.req.session);
//     console.log(res.req.sessionID);
//     // console.log(res['headers']);
//     // console.log(res.req.headers);
//     res.send(req.headers);
// })

module.exports = { app, db };