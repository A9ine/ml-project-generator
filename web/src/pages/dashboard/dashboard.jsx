import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, Clock } from 'lucide-react';
import Sidebar from '../../components/app/Sidebar';

const chartData = [
  { name: 'Jan', projects: 4 },
  { name: 'Feb', projects: 3 },
  { name: 'Mar', projects: 5 },
  { name: 'Apr', projects: 7 },
  { name: 'May', projects: 6 },
  { name: 'Jun', projects: 8 },
];

const ProjectCard = ({ title, description, status, progress }) => (
  <motion.div 
    className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    whileHover={{ scale: 1.03 }}
    layout
  >
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 mb-4">{description}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {status === 'completed' ? (
          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
        ) : (
          <Clock className="w-5 h-5 text-blue-400 mr-2" />
        )}
        <span className={status === 'completed' ? 'text-green-400' : 'text-blue-400'}>
          {status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </div>
      {status !== 'completed' && (
        <div className="w-24 bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [currentProjects, setCurrentProjects] = useState([
    { title: "ML Image Classification", description: "Developing a model to classify images of animals.", progress: 75 },
    { title: "Data Visualization Dashboard", description: "Creating an interactive dashboard for sales data.", progress: 30 },
  ]);

  const [completedProjects, setCompletedProjects] = useState([
    { title: "Sentiment Analysis", description: "Analyzed customer reviews for sentiment classification." },
    { title: "Predictive Maintenance", description: "Built a model to predict equipment failures." },
  ]);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-gray-800 shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, User!</span>
              <img src="/api/placeholder/40/40" alt="User" className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Project Statistics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Project Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Line type="monotone" dataKey="projects" stroke="#60A5FA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Current Projects */}
          <motion.div layout className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Current Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProjects.map((project, index) => (
                <ProjectCard key={index} {...project} status="in-progress" />
              ))}
            </div>
          </motion.div>

          {/* Completed Projects */}
          <motion.div layout>
            <h2 className="text-2xl font-semibold text-white mb-4">Completed Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((project, index) => (
                <ProjectCard key={index} {...project} status="completed" />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;