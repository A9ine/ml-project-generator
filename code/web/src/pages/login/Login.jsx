import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chrome, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../core/firebase';
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
      if (isAuthenticated()) {
          console.log('User is already authenticated. Redirecting to dashboard...');
          navigate('/dashboard');
      }
  }, [navigate]);

  const handleGoogleLogin = async () => {
      try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          console.log('Google login successful:', user);
          
          // Set the authToken in localStorage
          const authToken = {
              authenticated: true,
                  uid: user.uid,
                  username: user.email,
                  first_name: user.displayName
          };
          localStorage.setItem('authToken', JSON.stringify(authToken));
          
          setAlertType('success');
          setAlertMessage('Google login successful! Redirecting to dashboard...');
          navigate('/dashboard');
      } catch (error) {
          console.error('Google login error:', error);
          setAlertType('error');
          setAlertMessage('Google login failed. Please try again.');
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    setAlertType('');
    try {
        const response = await axios.post('http://127.0.0.1:2323/login', {
            username_or_email: email,
            password: password,
        });

        console.log('Login response:', response.data); // Add this line

        if (response.data.authenticated) {
          console.log('Login successful:', response.data);
          localStorage.setItem('authToken', JSON.stringify(response.data));
          setAlertType('success');
          setAlertMessage('Login successful! Redirecting to dashboard...');
          navigate('/dashboard');
        } else {
            setAlertType('error');
            setAlertMessage('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        setAlertType('error');
        setAlertMessage(error.response?.data?.error || 'Login failed due to a network error');
    }
};
const handleGitHubLogin = async () => {
  try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Github login successful:', user);
      
      
      // Here you would typically send the user data to your backend
      // and receive a token or some form of authentication
      // For now, we'll just simulate a successful login
      localStorage.setItem('authToken', JSON.stringify({ user: user.uid }));
      setAlertType('success');
      setAlertMessage('Github login successful! Redirecting to dashboard...');
      navigate('/dashboard');
  } catch (error) {
      console.error('Github login error:', error);
      setAlertType('error');
      setAlertMessage('Github login failed. Please try again.');
  }
};


    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                {alertMessage && (
                    <div className={`border-l-4 p-4 mb-4 ${
                        alertType === 'success' 
                            ? 'bg-green-100 border-green-500 text-green-700' 
                            : 'bg-red-100 border-red-500 text-red-700'
                    }`} role="alert">
                        <p>{alertMessage}</p>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-light-blue-500 focus:z-10 sm:text-sm mb-4"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-light-blue-500 focus:z-10 sm:text-sm"                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or login with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div>
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <Chrome className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <button onClick={handleGitHubLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <Github className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

        <div className="text-sm text-center">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>

        <div className="text-sm text-center">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>);
};

export default Login;