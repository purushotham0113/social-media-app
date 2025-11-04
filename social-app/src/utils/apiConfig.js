import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:3000/api", // change if your backend URL is different
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
