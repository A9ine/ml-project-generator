import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Sidebar from '../../components/app/Sidebar';

const libraries = [
  "NumPy", "Pandas", "TensorFlow", "Keras", "PyTorch", "Matplotlib", "Seaborn", "Scikit-learn"
];

const algorithms = [
  "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "SVM", "KNN"
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

const CreateProject = () => {
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [projectTheme, setProjectTheme] = useState('');

  const toggleSelection = (item, currentSelection, setSelection) => {
    if (currentSelection.includes(item)) {
      setSelection(currentSelection.filter(i => i !== item));
    } else {
      setSelection([...currentSelection, item]);
    }
  };

  const handleGenerateProject = () => {
    console.log('Generating project with:', { selectedLibraries, selectedAlgorithms, projectTheme });
    // Add your project generation logic here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Generate Your Customized ML Project</h1>
        
        {/* <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Libraries</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {libraries.map(lib => (
              <Card
                key={lib}
                title={lib}
                isSelected={selectedLibraries.includes(lib)}
                onClick={() => toggleSelection(lib, selectedLibraries, setSelectedLibraries)}
              />
            ))}
          </div>
        </div> */}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select ML Algorithms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {algorithms.map(algo => (
              <Card
                key={algo}
                title={algo}
                isSelected={selectedAlgorithms.includes(algo)}
                onClick={() => toggleSelection(algo, selectedAlgorithms, setSelectedAlgorithms)}
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg text-xl font-semibold transition-colors duration-300 ${
            selectedLibraries.length && selectedAlgorithms.length && projectTheme
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
          onClick={handleGenerateProject}
          disabled={!(selectedLibraries.length && selectedAlgorithms.length && projectTheme)}
        >
          Generate Project
        </motion.button>

        {/* {(selectedLibraries.length > 0 || selectedAlgorithms.length > 0) && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Summary</h2>
            {selectedLibraries.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl mb-2">Selected Libraries:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLibraries.map(lib => (
                    <span key={lib} className="bg-blue-600 px-2 py-1 rounded">{lib}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedAlgorithms.length > 0 && (
              <div>
                <h3 className="text-xl mb-2">Selected ML Algorithms:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAlgorithms.map(algo => (
                    <span key={algo} className="bg-blue-600 px-2 py-1 rounded">{algo}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default CreateProject;