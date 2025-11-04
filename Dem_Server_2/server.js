const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotEnv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Load environment variables
dotEnv.config();

// Middlewares
app.use(cors({
    origin: ['https://social-media-app-two-plum.vercel.app',
        'http://localhost:5174'
    ], // only allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const feedRoutes = require('./routes/feedRoutes');
const authRoutes = require('./routes/authRoutes');

// Error handler
const errorHandler = require('./middlewares/errorHandler');

// Route definitions
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.send("Server is healthy");
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
