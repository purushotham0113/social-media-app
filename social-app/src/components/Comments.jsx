import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { API } from '../utils/apiConfig';
import toast from 'react-hot-toast';
import { ArrowUp, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const CommentModal = ({ post, onClose, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useUser();

    const fetchComments = async () => {
        try {
            const res = await API.get(`/post/${post._id}/comments`);
            setComments(res.data.comments);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load comments');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await API.post(`/post/${post._id}/comment`, { text: newComment });
            setComments(res.data.post.comments);
            onCommentAdded(res.data.post);
            setNewComment('');
        } catch (err) {
            console.error(err);
            toast.error('Failed to add comment');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl shadow-lg p-4 flex flex-col h-[70vh]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Comments
                        </p>
                        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                            <X size={22} />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center mt-10">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c._id} className="flex items-start space-x-3">
                                    <img
                                        src={c.user.profilePic || '/default-avatar.png'}
                                        alt={c.user.username}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-gray-800 dark:text-gray-100 text-sm">
                                            <span className="font-semibold">{c.user.username}</span> {c.text}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(c.createdAt))} ago
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Box */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500"
                        />
                        <button
                            onClick={handleAddComment}
                            className="text-blue-500 hover:text-blue-600 transition-all"
                        >
                            <ArrowUp size={22} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default CommentModal;
