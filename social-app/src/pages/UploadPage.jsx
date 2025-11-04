import { useState } from "react";
import { API } from "../utils/apiConfig";
import { useUser } from "../context/UserContext";
import { motion } from 'framer-motion'
import toast, { Toaster } from "react-hot-toast";

const UploadPage = () => {
    const { token } = useUser();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async (e) => {
        console.log("inside the uload", token)
        e.preventDefault();
        if (!file || !caption) return toast.error("File and caption are required");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);

        try {
            console.log("inside the try token in upload  ", token)
            setLoading(true);
            const res = await API.post(`/post/add`, formData);
            toast.success("Post uploaded successfully!");
            setCaption("");
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}      // starts invisible and slightly below
            animate={{ opacity: 1, y: 0 }}       // fades in and slides up
            transition={{ duration: 0.6, ease: "easeOut" }} // smooth timing
            className="max-w-5xl mx-auto p-6"
        >
            <div className="max-w-xl mx-auto p-6">
                <Toaster position="top-right" />
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Upload a New Post</h2>

                <form onSubmit={handleUpload} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-700 dark:text-gray-100"
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg mt-2 mb-2 border border-gray-300 dark:border-gray-700"
                        />
                    )}

                    <textarea
                        placeholder="Add a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
                        rows={4}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                    >
                        {loading ? "Uploading..." : "Upload Post"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default UploadPage;
