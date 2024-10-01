import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import HomePage from '../../pages/home/HomePage';
import LoginPage from '../../pages/login/LoginPage';
import RegistrationPage from '../../pages/registration/RegistrationPage';
import ForgotPasswordPage from '../../pages/forgotpassword/ForgotPassword';
import Dashboard from '../../pages/dashboard/dashboard';
import CreateProject from '../../pages/create-project/CreateProjectPage';
import Profile from '../../pages/profile/ProfilePage';
import ProjectDetails from '../../pages/projectpage/ProjectDetails';

const isAuthenticated = () => {
    const authData = localStorage.getItem('authToken');
    console.log('Checking authentication, authData:', authData);
  
    if (!authData) {
      console.log('No auth data found');
      return false;
    }
    
    try {
      const userData = JSON.parse(authData);
      console.log('User data:', userData);
      return userData.authenticated === true;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      localStorage.removeItem('authToken');
      return false;
    }
  };
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

const NavRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<CreateProject/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/Project" element ={<ProjectDetails/>}/>
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default NavRoutes;