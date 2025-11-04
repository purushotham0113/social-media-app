import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import PostCard from '../components/PostCard';

const PostDetails = () => {
    const { pid } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        try {
            const res = await API.get(`/post/get/${pid}`);
            setPost(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment) return;
        try {
            const res = await API.post(`/post/comment/${pid}`, { text: comment });
            setPost(prev => ({ ...prev, comments: res.data.comments }));
            setComment('');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [pid]);

    if (loading || !post) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}      // starts invisible and slightly below
            animate={{ opacity: 1, y: 0 }}       // fades in and slides up
            transition={{ duration: 0.6, ease: "easeOut" }} // smooth timing
            className="max-w-5xl mx-auto p-6"
        >
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
                <PostCard post={post} />

                <div className="w-full max-w-xl mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Comments</h3>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            Comment
                        </button>
                    </div>

                    {post.comments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                    ) : (
                        post.comments.map((c, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <span className="font-bold text-gray-900 dark:text-gray-100">{c.user.username}:</span>
                                <span className="text-gray-700 dark:text-gray-300">{c.text}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PostDetails;
