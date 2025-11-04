const User = require('../models/User');
const Post = require('../models/Post');
const { set } = require('mongoose');

// Helper for consistent responses
const sendResponse = (res, status, success, message, data = {}) => {
    return res.status(status).json({ success, message, ...data });
};

// FEED - posts from followed users
const feed = async (req, res, next) => {
    try {
        // const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // const currentUser = await User.findById(userId);
        // if (!currentUser) return next({ status: 404, message: "User not found" });
        //inside finde = { userId: { $in: currentUser.following } }
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // latest posts first
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username profilePic')
            .populate('comments.user', 'username profilePic');

        return sendResponse(res, 200, true, "Feed retrieved", { posts, page, limit });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching feed" });
    }
};

// POPULAR - posts sorted by likes count
const popular = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // add virtual likesCount in Post schema for better sorting, otherwise sort by array length
        const posts = await Post.find()
            .sort({ 'likes.length': -1 }) // most liked first
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username profilePic')
            .populate('comments.user', 'username profilePic');

        return sendResponse(res, 200, true, "Popular posts retrieved", { posts, page, limit });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching popular posts" });
    }
};

// EXPLORE - suggest users to follow
const explore = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const mainUser = await User.findById(userId).select('followers following');
        if (!mainUser) return next({ status: 404, message: "User not found" });

        // Get all users except current user
        let users = await User.find({ _id: { $ne: userId } }).select('_id username profilePic');


        users = users.filter(u => !mainUser.following.includes(u._id) && !mainUser.followers.includes(u._id))

        const suggestedUsers = users.map(u => ({
            _id: u.id,
            username: u.username,
            profilePic: u.profilePic,
            following: false
        }));

        return sendResponse(res, 200, true, "Explore users retrieved", {
            suggestedUsers
        });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching explore users" });
    }
};

const search = async (req, res, next) => {
    try {
        const query = req.query.q?.trim();
        if (!query)
            return res.status(400).json([])

        const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('_id username profilePic').limit(10)

        return res.status(200).json(users)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" })
    }

}
module.exports = { feed, popular, explore, search };
