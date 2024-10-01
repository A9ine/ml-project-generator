import React from 'react';
import PageLayout from '../../components/app/PageLayout';
import Login from './Login';

const LoginPage = () => {
  const handleLoginSuccess = () => {
    console.log('Login successful');
  };

  return (
    <PageLayout>
      <Login onLoginSuccess={handleLoginSuccess} />
    </PageLayout>
  );
};

export default LoginPage;