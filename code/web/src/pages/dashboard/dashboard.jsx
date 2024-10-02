import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const ProjectCard = ({ id, title, description, status, progress, onClick }) => (
  <motion.div 
    className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    whileHover={{ scale: 1.03 }}
    layout
    onClick={() => onClick(id)}
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:2323/get-projects?user_id=1',{headers: {
          'ngrok-skip-browser-warning': '69420'
        }});
        console.log(response.data)
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    // Navigate to the Project page and pass the project ID as state
    navigate('/Project', { state: { projectId } });
  };

  const currentProjects = projects.filter(project => !project.completed);
  const completedProjects = projects.filter(project => project.completed);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
          {/* <motion.div 
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
          </motion.div> */}

          {/* Current Projects */}
          <motion.div layout className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Current Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
                  title={project.theme}
                  description={`Algorithm: ${project.algorithm}`}
                  status="in-progress"
                  progress={50} // You might want to add a progress field to your project data
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          </motion.div>

          {/* Completed Projects */}
          <motion.div layout>
            <h2 className="text-2xl font-semibold text-white mb-4">Completed Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
                  title={project.theme}
                  description={`Algorithm: ${project.algorithm}`}
                  status="completed"
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;