const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        shortDescription: { type: String, required: true },
        imageUrl: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const User = mongoose.model('Blog', blogSchema);

module.exports = User;
