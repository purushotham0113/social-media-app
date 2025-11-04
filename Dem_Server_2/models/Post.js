const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Virtual field to count likes (for popular feed)
postSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

// Ensure virtuals are included in JSON responses
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Index for faster queries on feed & popular
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1 });

module.exports = mongoose.model('Post', postSchema);
