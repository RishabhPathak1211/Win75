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
    const user = await User.findById(doc.author);
    user.products.push(doc._id);
    await user.save();
})

module.exports = mongoose.model('Product', ProductSchema);