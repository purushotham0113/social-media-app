import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { Home, Sun, Moon, Compass, Upload, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";
import { API } from "../utils/apiConfig";

const Navbar = ({ user, setUser }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    // 🔍 Debounced Search (only when user is logged in)
    useEffect(() => {
        if (!user) return; // do not fetch if not logged in
        if (!search.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await API.get(`/feed/search?q=${search}`);
                setResults(res.data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search, user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Logo + Home */}
                <div className="flex items-center gap-3">
                    <Logo />
                    <Link
                        to="/"
                        className="text-gray-800 dark:text-white hover:scale-105 transition-transform"
                    >
                        <Home />
                    </Link>
                </div>

                {/* 🔍 Desktop Search (only for logged-in users) */}
                {user && (
                    <div className="relative hidden md:block">
                        <FaSearch className="absolute left-3 top-2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="pl-9 pr-4 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500 w-60 transition-all"
                        />
                        {search && (
                            <div className="absolute mt-1 bg-white dark:bg-gray-800 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {loading ? (
                                    <p className="p-2 text-gray-500 dark:text-gray-300">
                                        Searching...
                                    </p>
                                ) : results.length > 0 ? (
                                    results.map((user) => (
                                        <Link
                                            key={user._id}
                                            to={`/profile/${user._id}`}
                                            onClick={() => setSearch("")}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <img
                                                src={user.profilePic || "/default-avatar.png"}
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <p className="text-gray-800 dark:text-gray-200">
                                                {user.username}
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="p-2 text-gray-500 dark:text-gray-300">
                                        No results found
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* 🔍 Mobile Search Icon (only for logged-in users) */}
                    {user && (
                        <button
                            onClick={() => setMobileSearchOpen(true)}
                            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                        >
                            <FaSearch size={18} />
                        </button>
                    )}

                    {user && (
                        <>
                            <Link
                                to="/explore"
                                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                            >
                                <Compass size={20} />
                            </Link>
                            <Link
                                to="/upload"
                                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
                            >
                                <Upload size={20} />
                            </Link>
                        </>
                    )}

                    {/* 🌙 Theme */}
                    <button
                        onClick={toggleTheme}
                        className="text-gray-700 dark:text-gray-200 hover:text-yellow-400 transition-colors"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* 👤 Auth */}
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <img
                                src={user.profilePic || "/default-avatar.png"}
                                alt="Profile"
                                className="w-8 h-8 rounded-full cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
                                    >
                                        <Link
                                            to={`/profile/${user._id}`}
                                            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        {/* <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Settings
                                        </Link> */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* 🔍 Mobile Search Overlay */}
            <AnimatePresence>
                {user && mobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center p-4"
                    >
                        <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                            <FaSearch className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setMobileSearchOpen(false);
                                    setSearch(""); // reset search on close
                                }}
                            >
                                <X className="text-gray-500 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="mt-3 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                            {loading ? (
                                <p className="p-3 text-gray-500 dark:text-gray-300">
                                    Searching...
                                </p>
                            ) : results.length > 0 ? (
                                results.map((user) => (
                                    <Link
                                        key={user._id}
                                        to={`/profile/${user._id}`}
                                        onClick={() => {
                                            setSearch("");
                                            setMobileSearchOpen(false);
                                        }}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <img
                                            src={user.profilePic || "/default-avatar.png"}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {user.username}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="p-3 text-gray-500 dark:text-gray-300">
                                    No results found
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
