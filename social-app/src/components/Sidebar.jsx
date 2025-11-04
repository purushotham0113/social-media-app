import React, { useContext, useEffect } from "react";
import { PostContext } from "../context/PostContext";

const Sidebar = () => {
    const { exploreUsers, fetchExplore } = useContext(PostContext);

    useEffect(() => {
        fetchExplore();
    }, []);

    return (
        <div className="hidden md:block w-64 p-4 bg-cardBg rounded-lg h-fit sticky top-16">
            <h2 className="text-mutedText font-semibold mb-2">Suggested Users</h2>
            {exploreUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between my-2">
                    <div className="flex items-center space-x-2">
                        <img
                            src={u.profilePic || "https://via.placeholder.com/40"}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <span>{u.username}</span>
                    </div>
                    <button className="text-primary hover:underline">Follow</button>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
