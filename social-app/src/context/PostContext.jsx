import { createContext, useState, useEffect } from "react";
import { API } from "../utils/apiConfig";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [feedPosts, setFeedPosts] = useState([]);
    const [exploreUsers, setExploreUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await API.get("/feed/get");
            setFeedPosts(res.data.posts);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const fetchExplore = async () => {
        try {
            const res = await API.get("/feed/explore");
            setExploreUsers(res.data.users);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <PostContext.Provider value={{ feedPosts, fetchFeed, exploreUsers, fetchExplore, loading }}>
            {children}
        </PostContext.Provider>
    );
};
