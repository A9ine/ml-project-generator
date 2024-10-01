import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Plus, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, text, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center space-x-2 p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
    whileHover={{ x: 5 }}
  >
    {icon}
    <span>{text}</span>
  </motion.button>
);

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="w-64 bg-gray-800 text-white p-5 h-screen">
        <h2 className="text-2xl font-bold mb-6">MLNotebookGen</h2>
        <nav className="space-y-2">
          <SidebarLink 
            icon={<BarChart2 className="w-5 h-5" />} 
            text="Dashboard" 
            onClick={() => handleNavigation('/dashboard')}
          />
          <SidebarLink 
            icon={<Plus className="w-5 h-5" />} 
            text="New Project" 
            onClick={() => handleNavigation('/new-project')}
          />
          {/* <SidebarLink 
            icon={<User className="w-5 h-5" />} 
            text="Profile" 
            onClick={() => handleNavigation('/profile')}
          />
          <SidebarLink 
            icon={<Settings className="w-5 h-5" />} 
            text="Settings" 
            onClick={() => handleNavigation('/settings')}
          /> */}
          <SidebarLink 
            icon={<LogOut className="w-5 h-5" />} 
            text="Logout" 
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </nav>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? This action will end your current session."
      />
    </>
  );
};

export default Sidebar;