import axios from "axios";

export const API = axios.create({
    // baseURL: "http://localhost:3000/api", 
    baseURL: 'https://social-media-app-backend-nfnd.onrender.com/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
