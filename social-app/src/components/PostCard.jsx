import React, { useState, useEffect } from "react";
import { API } from "../utils/apiConfig";
import Comment from "./Comments";
import { useUser } from "../context/UserContext";

const PostCard = ({ post }) => {
    console.log("in postcard", post)
    const { user } = useUser();
    const [comments, setComments] = useState(post.comments || []);

    // This function is passed into Comment.jsx as refreshComments
    const refreshComments = async () => {
        try {
            const res = await API.get(`/post/${post._id}`);

            setComments(res.data.comments);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            await API.put(`/post/like/${post._id}`);
            refreshComments(); // optional, can refetch entire post to update likes/comments
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="bg-darkBg rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
                <img
                    src={post.userId.profilePic || "https://via.placeholder.com/40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{post.userId.username}</span>
            </div>

            <p className="text-gray-200 mb-2">{post.text}</p>
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="post"
                    className="rounded-lg mb-2 w-full object-cover"
                />
            )}

            <div className="flex justify-between items-center">
                <button
                    onClick={handleLike}
                    className="text-sm text-blue-400 hover:underline"
                >
                    {post.likes?.includes(user._id) ? "Unlike" : "Like"}
                </button>
                <span className="text-gray-400 text-sm">
                    {post.likes?.length || 0} likes
                </span>
            </div>

            {/* Comments Section */}
            <Comment
                postId={post._id}
                comments={comments}
                refreshComments={refreshComments}
            />
        </div>
    );
};

export default PostCard;
