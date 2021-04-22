const mongoose = require('mongoose');
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
    imgs: [ImageSchema],
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cost: Number,
    category: {
        type: [String],
        default: ['Books']
    },
    genres: [String]
});

ProductSchema.post('save', async function (doc) {
    if (doc) {
        const user = await User.findById(doc.author);
        user.products.push(doc._id);
        await user.save();
    }
})

ProductSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const user = await User.findById(doc.author);
        const index = user.products.indexOf(doc._id);
        if (index > -1)
            user.products.splice(index, 1);
        await user.save();
    }
});

module.exports = mongoose.model('Product', ProductSchema);