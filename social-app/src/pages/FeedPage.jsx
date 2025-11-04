import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { API } from '../utils/apiConfig';
import CommentModal from '../components/Comments';
import { MessageCircle } from 'lucide-react';
import { Heart } from 'lucide-react';



const FeedPage = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch Posts
    const fetchPosts = async () => {
        try {
            const res = await API.get(`/feed/get`);
            setPosts(res.data.posts);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // 🔹 Like / Dislike
    const handleLike = async (pid) => {
        try {
            const res = await API.put(`/post/likes/${pid}`, {});
            setPosts((prev) =>
                prev.map((p) => (p._id === pid ? res.data.post : p))
            );
        } catch (err) {
            console.error(err);
            toast.error('Failed to like post');
        }
    };

    const handleDislike = async (pid) => {
        try {
            const res = await API.put(`/post/dislikes/${pid}`, {});
            setPosts((prev) =>
                prev.map((p) => (p._id === pid ? res.data.post : p))
            );
        } catch (err) {
            console.error(err);
            toast.error('Failed to dislike post');
        }
    };

    // 🔹 Loading UI
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-200">Loading feed...</p>
            </div>
        );
    }

    // 🔹 Feed Content
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-5xl mx-auto p-6"
        >
            <div className="max-w-3xl mx-auto p-4 space-y-6">
                <Toaster position="top-right" />

                {/* No Posts */}
                {posts.length === 0 && (
                    <p className="text-center text-gray-600 dark:text-gray-300">
                        No posts to show. Explore to find new friends!
                    </p>
                )}

                {/* Posts */}
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all"
                    >
                        {/* Post Header */}
                        <div className="flex items-center p-4">
                            <img
                                src={post.userId.profilePic || '/default-avatar.png'}
                                alt={post.userId.username}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                    {post.userId.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                </p>
                            </div>
                        </div>

                        {/* Post Image */}
                        <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full max-h-[500px] object-cover"
                        />

                        {/* Post Actions */}
                        <div className="px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* ❤️ Like / Dislike */}
                                {post.likes.includes(user._id) ? (

                                    <Heart
                                        onClick={() => handleDislike(post._id)}
                                        className="text-red-500 fill-red-500 cursor-pointer"
                                        size={28} // increase this number for bigger icon
                                    />
                                ) : (
                                    <Heart
                                        onClick={() => handleLike(post._id)}
                                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                                        size={28}
                                    />


                                )}
                                <span className="text-gray-700 dark:text-gray-200">{post.likes.length}</span>



                                {/* 💬 Comment Button + Count */}
                                <button
                                    onClick={() => setActivePost(post)}
                                    className="flex items-center text-gray-500 hover:text-blue-500 transition-all"
                                >
                                    <MessageCircle size={22} />
                                    <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {post.comments.length}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="px-4 py-2">
                            <p className="text-gray-800 dark:text-gray-100">
                                <span className="font-semibold">{post.userId.username} </span>
                                {post.caption}
                            </p>
                        </div>

                        {/* Comments Preview */}
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            {post.comments.slice(0, 2).map((c) => (
                                <p key={c._id} className="text-gray-700 dark:text-gray-300 text-sm">
                                    <span className="font-semibold">{c.user.username} </span>
                                    {c.text}
                                </p>
                            ))}
                            {post.comments.length > 2 && (
                                <p
                                    className="text-gray-500 dark:text-gray-400 text-sm cursor-pointer"
                                    onClick={() => setActivePost(post)}
                                >
                                    View all {post.comments.length} comments
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {/* 🔥 Single Comment Modal */}
                {activePost && (
                    <CommentModal
                        post={activePost}
                        onClose={() => setActivePost(null)}
                        onCommentAdded={(updatedPost) =>
                            setPosts((prev) =>
                                prev.map((p) =>
                                    p._id === updatedPost._id ? updatedPost : p
                                )
                            )
                        }
                    />
                )}
            </div>
        </motion.div>
    );
};

export default FeedPage;
