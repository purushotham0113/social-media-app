import { useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

const AddPostPage = () => {
    const { token } = useUser();
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("in handle")
        if (!file || !caption) return toast.error('Please provide both image and caption.');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', caption);
        console.log(formData)

        try {
            setLoading(true);
            console.log(token)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/post/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Post uploaded successfully!');
            setCaption('');
            setFile(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}      // starts invisible and slightly below
            animate={{ opacity: 1, y: 0 }}       // fades in and slides up
            transition={{ duration: 0.6, ease: "easeOut" }} // smooth timing
            className="max-w-5xl mx-auto p-6"
        >
            <div className="max-w-xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-lg shadow-md">
                <Toaster position="top-right" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Create New Post</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                    <textarea
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Post'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default AddPostPage;
