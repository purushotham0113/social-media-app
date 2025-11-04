const Post = require('../models/Post');

// Helper for consistent responses
const sendResponse = (res, status, success, message, data = {}) => {
    return res.status(status).json({ success, message, ...data });
};

// ADD POST
const addPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { caption } = req.body;
        const file = req.file;


        if (!caption || !file) return next({ status: 400, message: "Caption and file are required" });

        const newPost = new Post({
            userId,
            caption,
            imageUrl: file.path,
            likes: [],
            comments: []
        });

        const savedPost = await newPost.save();
        return sendResponse(res, 201, true, "Post added successfully", { post: savedPost });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error adding post" });
    }
};

// GET POST BY ID
const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'username profilePic')
            .populate('comments.user', 'username profilePic');

        if (!post) return next({ status: 404, message: "Post not found" });

        return sendResponse(res, 200, true, "Post retrieved successfully", { post });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching post" });
    }
};

// GET POSTS OF LOGGED-IN USER (with pagination)
const getPostsOfUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        // const userId = req.user.id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('comments.user', 'username profilePic');

        return sendResponse(res, 200, true, "User posts retrieved", { posts, page, limit });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching user posts" });
    }
};

// UPDATE POST
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const updatedPost = await Post.findByIdAndUpdate(postId, { $set: req.body }, { new: true });
        if (!updatedPost) return next({ status: 404, message: "Post not found" });

        return sendResponse(res, 200, true, "Post updated successfully", { post: updatedPost });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error updating post" });
    }
};

// DELETE POST
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) return next({ status: 404, message: "Post not found" });

        return sendResponse(res, 200, true, "Post deleted successfully");
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error deleting post" });
    }
};

// LIKE POST
const likePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.pid;

        const post = await Post.findById(postId);
        if (!post) return next({ status: 404, message: "Post not found" });

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        return sendResponse(res, 200, true, "Post liked", { post });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error liking post" });
    }
};

// DISLIKE POST
const dislikePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.pid;

        const post = await Post.findById(postId);
        if (!post) return next({ status: 404, message: "Post not found" });

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        return sendResponse(res, 200, true, "Post disliked", { post });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error disliking post" });
    }
};

// ADD COMMENT

// ADD COMMENT
const addComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.pid;
        const { text } = req.body;

        if (!text || !text.trim())
            return next({ status: 400, message: "Comment text is required" });

        // 1️⃣ Find post
        const post = await Post.findById(postId);
        if (!post) return next({ status: 404, message: "Post not found" });

        // 2️⃣ Add comment
        post.comments.push({
            user: userId,
            text: text.trim(),
            createdAt: new Date()
        });

        // 3️⃣ Save post
        await post.save();

        // 4️⃣ Populate for client response
        const updatedPost = await Post.findById(postId)
            .populate('userId', 'username profilePic')
            .populate('comments.user', 'username profilePic');

        return sendResponse(res, 200, true, "Comment added", { post: updatedPost });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error adding comment" });
    }
};

// GET COMMENTS

// GET COMMENTS
const getComments = async (req, res, next) => {
    try {
        const postId = req.params.pid;

        const post = await Post.findById(postId)
            .populate('comments.user', 'username profilePic');

        if (!post)
            return next({ status: 404, message: "Post not found" });

        // Sort comments newest → oldest
        const sortedComments = [...post.comments].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return sendResponse(res, 200, true, "Comments retrieved", { comments: sortedComments });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching comments" });
    }
};


module.exports = {
    addPost,
    getPost,
    getPostsOfUser,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    addComment,
    getComments
};
