import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit } from 'lucide-react';
import Sidebar from '../../components/app/Sidebar';

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center mb-4">
    {icon}
    <div className="ml-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-lg">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedAuthToken = localStorage.getItem('authToken');
        if (storedAuthToken) {
          const parsedAuthToken = JSON.parse(storedAuthToken);
          if (parsedAuthToken && parsedAuthToken.authenticated) {
            setUserData({
              authenticated: parsedAuthToken.authenticated,
              first_name: parsedAuthToken.first_name || '',
              user_id: parsedAuthToken.user_id || '',
              username: parsedAuthToken.username || ''
            });
          } else {
            setError('User data not found or user not authenticated');
          }
        } else {
          setError('AuthToken not found in localStorage');
        }
      } catch (err) {
        setError('Error parsing authToken');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    if (!userData) return;

    const newDisplayName = prompt("Enter new display name:", userData.first_name);
    if (newDisplayName && newDisplayName !== userData.first_name) {
      // Update the display name in your backend/database here
      // Then update localStorage and state
      const updatedAuthToken = JSON.parse(localStorage.getItem('authToken'));
      updatedAuthToken.first_name = newDisplayName;
      localStorage.setItem('authToken', JSON.stringify(updatedAuthToken));
      setUserData(prevData => ({ ...prevData, first_name: newDisplayName }));
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-white">No user data available</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <header className="bg-gray-800 shadow-md p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img 
                src="/api/placeholder/80/80" 
                alt="Profile" 
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{userData.first_name || 'User'}</h2>
                <p className="text-gray-400">ML Enthusiast</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField 
              icon={<User className="w-6 h-6 text-blue-400" />}
              label="First Name"
              value={userData.first_name || 'Not set'}
            />
            <ProfileField 
              icon={<Mail className="w-6 h-6 text-blue-400" />}
              label="Username (Email)"
              value={userData.username || 'Not available'}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-2">About Me</h3>
            <p className="text-gray-300">Bio information not available in current authToken structure. Consider adding this in your user profile data.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;