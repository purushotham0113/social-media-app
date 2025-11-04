import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useUser } from './context/UserContext';
import AddPostPage from './pages/AddPostPage';
import PostCard from './components/PostCard';


function App() {
  const { user, setUser } = useUser();
  // console.log("inside app", user)

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <Navbar user={user} setUser={setUser} />

      <div className="pt-16"> {/* spacing for fixed navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post" element={<PostCard />} />



          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/uploads'
            element={
              <ProtectedRoute user={user}>
                <UploadPage />
              </ProtectedRoute>
            }

          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute user={user}>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userIdParam"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute user={user}>
                <UploadPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
