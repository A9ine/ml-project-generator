import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import Sidebar from '../../components/app/Sidebar';

const algorithms = [
  "Linear Regression", "Logistic Regression"
];

const Card = ({ title, isSelected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`cursor-pointer p-4 rounded-lg shadow-md transition-colors duration-300 ${
      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <span>{title}</span>
      {isSelected && <CheckCircle className="w-5 h-5" />}
    </div>
  </motion.div>
);

const ProcessingModal = ({ isOpen, timeRemaining }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800 flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-xl font-semibold">Model is cooking...</p>
          <p className="mt-2">
            {timeRemaining > 0 
              ? `Estimated time remaining: ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
              : "We're almost there!"
            }
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.max((150 - timeRemaining) / 150 * 100, 0)}%` }}
            ></div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CreateProject = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [projectTheme, setProjectTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(150); // 2 minutes and 30 seconds
  const navigate = useNavigate();

  const handleAlgorithmSelection = (algorithm) => {
    setSelectedAlgorithm(selectedAlgorithm === algorithm ? '' : algorithm);
  };

  useEffect(() => {
    let timer;
    if (isLoading && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading, timeRemaining]);

  const handleGenerateProject = async () => {
    setIsLoading(true);
    setError(null);
    setTimeRemaining(150); // Reset the timer
  
    try {
      const response = await axios.post('https://chief-hot-panda.ngrok-free.app/generate-data', {
        theme: projectTheme,
        algorithm: selectedAlgorithm,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
      });
  
      if (response.data.success) {
        console.log('Project generated successfully');
        navigate('/Project', { state: { projectId: response.data.projectId } });
      } else {
        setError('Failed to generate project. Please try again.');
      }
    } catch (err) {
      console.error('Error details:', err);
      if (err.response) {
        console.error("Server responded with error:", err.response.status, err.response.data);
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", err.message);
        setError(`Request setup error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Generate Your Customized ML Project</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select ML Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithms.map(algo => (
              <Card
                key={algo}
                title={algo}
                isSelected={selectedAlgorithm === algo}
                onClick={() => handleAlgorithmSelection(algo)}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Enter Project Theme</h2>
          <input
            type="text"
            value={projectTheme}
            onChange={(e) => setProjectTheme(e.target.value)}
            placeholder="What would you like your project to be about?"
            className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-300"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500">
            Error: {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg text-xl font-semibold transition-colors duration-300 ${
            selectedAlgorithm && projectTheme && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
          onClick={handleGenerateProject}
          disabled={!(selectedAlgorithm && projectTheme) || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Project'}
        </motion.button>
      </div>
      <ProcessingModal isOpen={isLoading} timeRemaining={timeRemaining} />
    </div>
  );
};

export default CreateProject;