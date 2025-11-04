import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
            const { token } = res.data;

            // Save user info in context (we decode username from token or fetch later)
            const payload = JSON.parse(atob(token.split('.')[1]));
            loginUser({ _id: payload.id, username: payload.username }, token);

            toast.success('Registration Successful!');
            navigate('/'); // redirect to Feed
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Registration failed');
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
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Toaster position="top-right" />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl w-96"
                >
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Register</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all disabled:opacity-60"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RegisterPage;
