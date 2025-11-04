const User = require('../models/User');

// Helper for consistent responses
const sendResponse = (res, status, success, message, data = {}) => {
    return res.status(status).json({ success, message, ...data });
};

// GET PROFILE BY ID (public)
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // exclude password
        if (!user) return next({ status: 404, message: "User not found" });

        return sendResponse(res, 200, true, `Profile retrieved for ${user.username}`, { user });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching user" });
    }
};

// GET PROFILE (logged-in user)
const getProfile = async (req, res, next) => {
    try {
        const { id } = req.params;      // profile being viewed
        const viewerId = req.user.id;   // logged-in user ID

        const profileUser = await User.findById(id)
            .select('_id username profilePic bio following')
            .lean();

        if (!profileUser)
            return res.status(404).json({ message: 'User not found' });

        // Find followers and following lists
        const followers = await User.find({ following: id })
            .select('_id username profilePic following')
            .lean();

        const following = await User.find({ _id: { $in: profileUser.following } })
            .select('_id username profilePic following')
            .lean();

        // Find logged-in user's following list for correct flags
        const viewer = await User.findById(viewerId).select('following').lean();

        const formattedFollowers = followers.map(f => ({
            _id: f._id,
            username: f.username,
            profilePic: f.profilePic,
            following: viewer.following.some(fid => fid.toString() === f._id.toString())
        }));

        const formattedFollowing = following.map(f => ({
            _id: f._id,
            username: f.username,
            profilePic: f.profilePic,
            following: viewer.following.some(fid => fid.toString() === f._id.toString())
        }));

        return sendResponse(res, 200, true, `Profile retrieved`, {
            user: {
                _id: profileUser._id,
                username: profileUser.username,
                profilePic: profileUser.profilePic,
                bio: profileUser.bio,
                followers: formattedFollowers,
                following: formattedFollowing
            }
        });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching profile" });
    }
};

// UPDATE USER (protected)
const updateUser = async (req, res, next) => {
    try {
        console.log("inside update user")
        const id = req.user.id;


        const { bio } = req.body;

        const file = req.file;

        const updates = {};
        if (bio) updates.bio = bio;
        if (file) updates.profilePic = file.path;
        console.log(updates)

        // Prevent unsafe updates


        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!updatedUser) return next({ status: 404, message: "User not found" });

        return sendResponse(res, 200, true, "User updated successfully", { user: updatedUser });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error updating user" });
    }
};

// FOLLOW USER
const followById = async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.tid;
        console.log("inside follow by id")
        console.log(currentUserId)
        console.log(targetUserId)

        if (currentUserId === targetUserId)
            return next({ status: 400, message: "You cannot follow yourself" });

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) return next({ status: 404, message: "User not found" });
        if (currentUser.following.includes(targetUserId))
            return next({ status: 400, message: "Already following this user" });

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return sendResponse(res, 200, true, "Followed successfully");
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error following user" });
    }
};

// UNFOLLOW USER
const unfollowById = async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.tid;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) return next({ status: 404, message: "User not found" });
        if (!currentUser.following.includes(targetUserId))
            return next({ status: 400, message: "You are not following this user" });

        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        return sendResponse(res, 200, true, "Unfollowed successfully");
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error unfollowing user" });
    }
};

// GET FOLLOWERS (protected)
const followers = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('followers', 'username profilePic');
        if (!user) return next({ status: 404, message: "User not found" });

        return sendResponse(res, 200, true, "Followers retrieved", { followers: user.followers });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching followers" });
    }
};

// GET FOLLOWING (protected)
const following = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('following', 'username profilePic');
        if (!user) return next({ status: 404, message: "User not found" });

        return sendResponse(res, 200, true, "Following retrieved", { following: user.following });
    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error fetching following" });
    }
};

module.exports = { getUserById, getProfile, updateUser, followById, unfollowById, followers, following };
