const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const userRoutes = require('./routes/user');

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

module.exports = { app, db };