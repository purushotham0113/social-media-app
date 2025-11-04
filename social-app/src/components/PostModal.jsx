import React from "react";
import PostCard from "./PostCard";

const PostModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-cardBg rounded-lg max-w-3xl w-full flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1">
                    <img
                        src={post.imageUrl}
                        alt="post"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                    <PostCard post={post} />
                    <button
                        onClick={onClose}
                        className="mt-auto bg-primary py-2 rounded text-darkBg font-semibold hover:opacity-90 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
