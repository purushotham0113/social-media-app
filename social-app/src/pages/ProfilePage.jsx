import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from '../context/UserContext';
import { Trash2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { API } from '../utils/apiConfig';
import { useParams } from "react-router-dom";
import UserCard from '../components/UserCard';


const ProfilePage = () => {

    const { userIdParam } = useParams();
    const { user, token } = useUser();
    const [show, setShow] = useState('post')
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);

    // 🔹 Fetch user profile and posts
    const fetchProfile = async () => {
        try {
            const res = await API.get(`/user/profile/${userIdParam}`)

            setProfile(res.data.user);

            setBio(res.data.user.bio || '');

            // Fetch posts of the user
            const postRes = await API.get(`/post/user/${userIdParam}`)
            setPosts(postRes.data.posts);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Handle Post Delete
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await API.delete(`/post/delete/${postId}`);

            // remove deleted post from state instantly
            setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
            toast.success("Post deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete post");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userIdParam]);

    // 🔹 Handle profile picture selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    // 🔹 Handle save/update request
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            if (bio) formData.append('bio', bio);
            if (profilePic) formData.append('file', profilePic);

            const res = await API.put(`/user/update`, formData);

            setProfile(res.data.user); // your backend returns { user: updatedUser }
            toast.success('Profile updated!');
            setEditMode(false);
            setPreview(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile');
        }
    };

    // 🔹 Handle follow/unfollow toggle
    const handleFollowToggle = async () => {
        try {
            if (profile.followers.includes(user._id)) {
                await API.post(`/user/unfollows/${profile._id}`, {});
                setProfile((prev) => ({
                    ...prev,
                    followers: prev.followers.filter((id) => id !== user._id),
                }));
                toast.success('Unfollowed user');
            } else {
                await API.post(`/user/follows/${profile._id}`, {});
                setProfile((prev) => ({
                    ...prev,
                    followers: [...prev.followers, user._id],
                }));
                toast.success('Followed user');
            }
        } catch (err) {
            console.error(err);
            toast.error('Action failed');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-200">Loading profile...</p>
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
            <Toaster position="top-right" />

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">

                {/* 🔹 Profile Picture */}
                <div className="relative">
                    <img
                        src={preview || profile.profilePic || '/default-avatar.png'}
                        alt={profile.username}
                        className="w-32 h-32 rounded-full object-cover shadow-md"
                    />
                    {editMode && (
                        <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer text-sm">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            📸
                        </label>
                    )}
                </div>

                {/* 🔹 Profile Info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {profile.username}
                        </h2>

                        {profile._id === user._id ? (
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            >
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </button>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                className={`px-4 py-1 rounded-lg transition-all ${profile.followers.includes(user._id)
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {profile.followers.includes(user._id) ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>

                    {/* 🔹 Bio */}
                    {!editMode ? (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            {profile.bio || 'No bio yet'}
                        </p>
                    ) : (
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Your bio..."
                            className="w-full mt-2 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
                        />
                    )}

                    {/* 🔹 Save Button */}
                    {editMode && (
                        <button
                            onClick={handleUpdate}
                            className="mt-2 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                            Save
                        </button>
                    )}

                    {/* 🔹 Followers / Following */}
                    <div className="flex space-x-6 mt-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{profile.followers.length}</span> Followers
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{profile.following.length}</span> Following
                        </p>
                    </div>

                    {/* follow/following/post buttons */}
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() => setShow('post')}
                            className={`px-3 py-1 rounded-lg ${show === 'post' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setShow('followers')}
                            className={`px-3 py-1 rounded-lg ${show === 'followers' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}
                        >
                            Followers
                        </button>
                        <button
                            onClick={() => setShow('following')}
                            className={`px-3 py-1 rounded-lg ${show === 'following' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}
                        >
                            Following
                        </button>
                    </div>

                </div>
            </div>

            {/* 🔹 User Posts Grid */}
            {show == 'post' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {posts.map((p) => (
                        <div key={p._id} className="relative group">
                            <img
                                src={p.imageUrl}
                                alt={p.caption}
                                className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-all"
                            />

                            {/* 🔹 Delete Button (only show if it's the user's own profile) */}
                            {profile._id === user._id && (
                                <button
                                    onClick={() => handleDeletePost(p._id)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Post"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {show === 'followers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {profile.followers.length > 0 ? (
                        profile.followers.map(u => (
                            <UserCard key={u._id} u={u} />
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No followers yet.</p>
                    )}
                </div>
            )}

            {show === 'following' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {profile.following.length > 0 ? (
                        profile.following.map(u => (
                            <UserCard key={u._id} u={u} />
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Not following anyone yet.</p>
                    )}
                </div>
            )}

        </motion.div>
    );
};

export default ProfilePage;
