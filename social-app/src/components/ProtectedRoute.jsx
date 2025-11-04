import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ user, children }) => {
    const { loading } = useUser();

    // Show nothing or a loader while checking auth
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-200">Loading...</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authorized: render child components
    return children;
};

export default ProtectedRoute;
