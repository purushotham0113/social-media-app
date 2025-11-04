import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const UserContext = createContext();

// Custom hook for easy access
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
    const [token, setToken] = useState("")
    const [user, setUser] = useState(null); // user object
    const [loading, setLoading] = useState(true); // for initial load

    // Load user from localStorage token on app start
    useEffect(() => {
        // console.log("in usecontext")
        const storedToken = localStorage.getItem('token');
        // console.log(storedToken)

        if (storedToken) {
            try {
                // console.log(token)
                // decode token to get user data
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                // console.log("payload")
                // console.log(payload)
                setUser({
                    _id: payload.id,
                    username: payload.username,
                    profilePic: payload.profilePic || '/default-avatar.png',
                    followers: payload.followers,
                    following: payload.following
                });
                setToken(storedToken)
            } catch (err) {
                console.error('Invalid token', err);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // login function
    const loginUser = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    // logout function
    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, token, setUser, loginUser, logoutUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
