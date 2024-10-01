import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileDown, Loader, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/app/Sidebar';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-xl font-semibold mb-4">Confirm Project Completion</h2>
          <p className="mb-6">Are you sure you want to mark this project as complete?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProjectDetails = () => {
  const location = useLocation();
  const { projectId } = location.state || {};
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching project details...');
        const response = await axios.get(`https://chief-hot-panda.ngrok-free.app/get-notebook?project_id=${projectId}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
        console.log('Project details fetched:', response.data);
        setProject(response.data);
      } catch (err) {
        console.error('Failed to fetch project details:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProjectDetails();
  }, [projectId]);
  
  const handleDownload = async (url, fileType) => {
    console.log(`Attempting to download ${fileType}...`);
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      console.log(`${fileType} download response received:`, response);
      
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      
      const fileName = `project_${project.theme.replace(/ /g, '_')}_${fileType}.${fileType === 'notebook' ? 'ipynb' : 'csv'}`;      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      console.log(`Triggering download for ${fileName}`);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Failed to download ${fileType}:`, err);
      alert(`Failed to download ${fileType}. Please try again.`);
    }
  };

  const handleDownloadNotebook = () => {
    console.log('Download notebook button clicked');
    handleDownload(`https://chief-hot-panda.ngrok-free.app/download-notebook?project_id=${projectId}`, 'notebook');
  };

  const handleDownloadDataset = () => {
    console.log('Download dataset button clicked');
    handleDownload(`https://chief-hot-panda.ngrok-free.app/download-csv?project_id=${projectId}`, 'dataset');
  };

  const handleCompleteProject = async () => {
    try {
      const response = await axios.post(`https://chief-hot-panda.ngrok-free.app/complete-project`, 
        { project_id: projectId },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      if (response.data.success) {
        setProject({ ...project, is_completed: true });
        alert('Project marked as complete successfully!');
      } else {
        alert('Failed to mark project as complete. Please try again.');
      }
    } catch (err) {
      console.error('Error completing project:', err);
      alert('An error occurred while trying to complete the project. Please try again.');
    }
    setIsConfirmationOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">{project?.theme}</h1>
          <p className="text-xl text-gray-400 mb-6">Algorithm: {project?.algorithm}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Project Description</h2>
              <p className="text-gray-300">{project?.description || 'No description available.'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              onClick={handleDownloadNotebook}
            >
              <FileDown className="mr-2" /> Download Notebook
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
              onClick={handleDownloadDataset}
            >
              <Download className="mr-2" /> Download Dataset
            </motion.button>
            {!project?.is_completed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                onClick={() => setIsConfirmationOpen(true)}
              >
                <CheckCircle className="mr-2" /> Complete Project
              </motion.button>
            )}
          </div>
          {project?.is_completed ? (
  <p className="mt-4 text-green-400 font-semibold">This project is completed!</p>
) : (
  <p className="mt-4 text-red-400 font-semibold"></p>
)}

        </motion.div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleCompleteProject}
      />
    </div>
  );
};

export default ProjectDetails;