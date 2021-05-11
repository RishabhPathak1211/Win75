const mongoose = require('mongoose');
const moment = require('moment-timezone');
const User = require('./user');

const dateIndia = moment.tz(Date.now(), 'Asia/Kolkata');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    imgs: [ImageSchema],
    imageUrl: String,
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    advertisment: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    created: {
        type: Date,
        default: dateIndia
    },
    price: Number,
    category: String,
    tags: [String],
});

ProductSchema.index(
    {
        title: "text",
        description: "text",
        tags: "text"
    }, 
    {
        weights: {
            title: 10,
            description:5,
            tags: 8
        },
        name: 'search'
    }
);

ProductSchema.post('save', async function (doc) {
    if (doc) {
        const user = await User.findById(doc.author);
        user.myProducts.push(doc._id);
        await user.save();
    }
})

ProductSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const user = await User.findById(doc.author);
        const index = user.myProducts.indexOf(doc._id);
        if (index > -1)
            user.myProducts.splice(index, 1);
        await user.save();
    }
});

module.exports = mongoose.model('Product', ProductSchema);