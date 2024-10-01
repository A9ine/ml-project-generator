import React, { useState } from 'react';
import axios from 'axios';
import PageLayout from '../../components/app/PageLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:2323/getVerification', { email });
      setMessage('Verification code sent to your email.');
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send verification code.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:2323/changePassword', {
        email,
        new_password: newPassword,
        verification_code: verificationCode
      });
      setMessage('Password changed successfully. You can now log in with your new password.');
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password.');
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          </div>
          {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">{message}</div>}
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
          
          {step === 1 && (
            <form onSubmit={handleSendVerification} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Verification Code
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleChangePassword} className="mt-8 space-y-6">
              <div>
                <label htmlFor="verificationCode" className="sr-only">Verification Code</label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-600">
                Your password has been changed successfully.
              </p>
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Return to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ForgotPasswordPage;