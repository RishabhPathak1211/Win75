const mongoose = require('mongoose');
const { cloudinary } = require('../utils/cloudinary');
const ExpressError = require('../utils/ExpressError');
const User = require('./user');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    imgs: {
        type: [ImageSchema],
        defaule: []
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    advertisement: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [String],
}, { versionKey: false });

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

ProductSchema.pre('save', async function (next) {
    try {
        const user = await User.findById(this.author);
        user.myProducts.push(this._id);
        user.activityLog.push({ product: this._id, activityType: 'Created' });
        await user.save();
        next();
    } catch (e) {
        next(new ExpressError('Something went wrong', 500, e));
    }
});

ProductSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        const user = await User.findById(doc.author);
        user.activityLog.push({ product: doc._id, activityType: 'Updated' });
        await user.save();
    }
});

ProductSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        for (let img of doc.imgs) await cloudinary.uploader.destroy(img.filename);
        const user = await User.findById(doc.author);
        const index = user.myProducts.indexOf(doc._id);
        if (index > -1)
            user.myProducts.splice(index, 1);
        await user.save();
    }
});

module.exports = mongoose.model('Product', ProductSchema);