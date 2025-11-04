import { createContext, useState, useEffect } from "react";
import { API } from "../utils/apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/user/profile");
            setUser(res.data.user || res.data);
        } catch (err) {
            console.log(err);
            setUser(null);
        }
    };

    const login = async (username, password) => {
        const res = await API.post("/user/login", { username, password });
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const register = async (username, email, password) => {
        const res = await API.post("/user/register", { username, email, password });
        setToken(res.data.token);
        fetchProfile();
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};
