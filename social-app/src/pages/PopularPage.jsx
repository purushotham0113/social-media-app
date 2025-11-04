import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from "framer-motion";
import dayjs from 'dayjs';
import { API } from '../utils/apiConfig';

const PopularPage = () => {
    const { token, user } = useUser();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    const fetchPopularPosts = async () => {
        if (!hasMore) return;
        try {
            setLoading(true);
            const res = await API.get(`/feed/popular?page=${page}&limit=5`);
            if (res.data.posts.length === 0) setHasMore(false);
            setPosts((prev) => [...prev, ...res.data.posts]);
            setPage((prev) => prev + 1);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load popular posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularPosts();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}      // starts invisible and slightly below
            animate={{ opacity: 1, y: 0 }}       // fades in and slides up
            transition={{ duration: 0.6, ease: "easeOut" }} // smooth timing
            className="max-w-5xl mx-auto p-6"
        >
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Popular Posts</h2>

                {posts.map((post) => (
                    <div key={post._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <img
                                src={post.userId.profilePic || '/default-avatar.png'}
                                alt={post.userId.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{post.userId.username}</p>
                                <p className="text-gray-500 text-sm">{dayjs(post.createdAt).fromNow()}</p>
                            </div>
                        </div>

                        <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full h-64 object-cover rounded-lg mb-2 hover:scale-105 transition-all"
                        />

                        <p className="text-gray-800 dark:text-gray-100 mb-2">{post.caption}</p>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 dark:text-gray-300">{post.likes.length} likes</span>
                        </div>
                    </div>
                ))}

                {hasMore && (
                    <button
                        onClick={fetchPopularPosts}
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default PopularPage;
