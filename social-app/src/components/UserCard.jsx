import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { API } from '../utils/apiConfig';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UserCard({ u }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(u.following || false);

    const handleFollow = async (tid) => {
        setLoading(true);
        try {
            await API.post(`/user/follows/${tid}`, {});
            setIsFollowing(true);
            toast.success('Followed user!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to follow');
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async (tid) => {
        setLoading(true);
        try {
            await API.post(`/user/unfollows/${tid}`, {});
            setIsFollowing(false);
            toast.success('Unfollowed user!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to unfollow');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        if (loading) return; // prevent click spam
        navigate(`/profile/${u._id}`);
    };

    return (
        <>
            <Toaster position="top-right" />
            <div
                key={u._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-all flex flex-col items-center"
            >
                <img
                    src={u.profilePic || '/default-avatar.png'}
                    alt={u.username}
                    className={`w-20 h-20 rounded-full object-cover mb-2 ${loading ? 'opacity-70' : 'cursor-pointer'}`}
                    onClick={handleProfileClick}
                />
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{u.username}</p>

                {u._id === user._id ? (
                    <p className="text-gray-500 text-sm">You</p>
                ) : isFollowing ? (
                    <button
                        disabled={loading}
                        onClick={() => handleUnfollow(u._id)}
                        className={`px-4 py-1 rounded-lg text-sm transition-all ${loading
                                ? 'bg-red-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                    >
                        {loading ? '...' : 'Unfollow'}
                    </button>
                ) : (
                    <button
                        disabled={loading}
                        onClick={() => handleFollow(u._id)}
                        className={`px-4 py-1 rounded-lg text-sm transition-all ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {loading ? '...' : 'Follow'}
                    </button>
                )}
            </div>
        </>
    );
}
