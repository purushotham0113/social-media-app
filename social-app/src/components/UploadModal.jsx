import React, { useState, useContext } from "react";
import { API } from "../utils/apiConfig";
import { PostContext } from "../context/PostContext";

const UploadModal = ({ isOpen, onClose }) => {
    const { fetchFeed } = useContext(PostContext);
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !caption) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("caption", caption);

            await API.post("/post/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchFeed();
            setCaption("");
            setFile(null);
            onClose();
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-cardBg rounded-lg p-6 w-80">
                <h2 className="text-xl font-bold mb-4">Add Post</h2>
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="p-2 rounded bg-darkBg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-1 rounded bg-primary text-darkBg font-semibold hover:opacity-90 transition"
                        >
                            {loading ? "Uploading..." : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default UploadModal;
