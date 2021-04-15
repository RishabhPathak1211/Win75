const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost:27017/win75';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
    db.collection('Session', (err, collection) => {
        console.log('Entered');
        if (err)
            console.log(err);
        else {
            collection.find({}, function (err, items) {
                console.log(typeof(items));
            })
        }
        db.close();
    });
});