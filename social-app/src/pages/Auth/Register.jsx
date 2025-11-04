import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(username, email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-darkBg">
            <form
                onSubmit={handleSubmit}
                className="bg-cardBg p-8 rounded-lg flex flex-col space-y-4 w-80"
            >
                <h2 className="text-2xl font-bold text-center">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 rounded bg-darkBg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-darkBg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-darkBg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <button
                    type="submit"
                    className="bg-primary py-2 rounded font-semibold hover:opacity-90 transition"
                >
                    Register
                </button>
                <p className="text-mutedText text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
