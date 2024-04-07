const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    image: {
        type: String,
        required: [true, 'image is required']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id is required']
    },
    comments: [commentSchema], // Using the comment schema
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    category: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

const blogModel = mongoose.model('Blog', blogSchema);

module.exports = blogModel;
