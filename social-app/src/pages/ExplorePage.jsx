import { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import UserCard from '../components/UserCard';
import API from '../api/axios';

const ExplorePage = () => {
    const { user } = useUser();
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExplore = async () => {
        try {
            const res = await API.get('/feed/explore')
            setSuggestedUsers(res.data.suggestedUsers);


        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch suggestions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExplore();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-200">Loading suggestions...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}      // starts invisible and slightly below
            animate={{ opacity: 1, y: 0 }}       // fades in and slides up
            transition={{ duration: 0.6, ease: "easeOut" }} // smooth timing
            className="max-w-5xl mx-auto p-6"
        >
            <div className="max-w-5xl mx-auto p-6">
                <Toaster position="top-right" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Explore Users</h2>
                {suggestedUsers.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-300">No suggestions available</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {suggestedUsers.map((u) => (
                        <UserCard key={u._id} u={u} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ExplorePage;
