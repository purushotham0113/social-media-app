const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// Helper for sending consistent responses
const sendResponse = (res, status, success, message, data = {}) => {
    return res.status(status).json({ success, message, ...data });
};

// REGISTER
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next({ status: 400, message: "Please provide username, email, and password" });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return next({ status: 400, message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = generateToken(user);

        return sendResponse(res, 201, true, "User registered successfully", { token });

    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error during registration" });
    }
};

// LOGIN
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return next({ status: 400, message: "Please provide username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) return next({ status: 404, message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return next({ status: 401, message: "Invalid credentials" });

        const token = generateToken(user);

        // Remove password from response
        const { password: _, ...userData } = user._doc;

        return sendResponse(res, 200, true, "Login successful", { token, user: userData });

    } catch (err) {
        console.error(err);
        return next({ status: 500, message: "Server error during login" });
    }
};

module.exports = { register, login };
