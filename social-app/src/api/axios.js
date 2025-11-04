import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // update if your backend URL is different
});

// Attach token automatically if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
