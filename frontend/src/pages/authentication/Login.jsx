import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(credentials);

      console.log(response);
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success('Login successful!');

      navigate('/product-type');
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 px-4'>
      <div className='bg-white shadow-2xl rounded-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2'>
        {/* Left Side / Illustration */}
        <div className='hidden md:flex items-center justify-center bg-indigo-600 text-white p-10'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>Find Perfect Gifts</h1>
            <p className='text-lg'>
              Discover personalized gift recommendations based on personality
              types.
            </p>
          </div>
        </div>

        {/* Right Side / Login Form */}
        <div className='p-8 sm:p-10'>
          {/* Tabs */}
          <div className='flex mb-6 border-b border-gray-200'>
            <Link
              to='/login'
              className='mr-4 pb-2 text-blue-600 font-semibold border-b-2 border-blue-600'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='pb-2 text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
            >
              Register
            </Link>
          </div>

          <h2 className='text-2xl font-bold mb-2'>Welcome Back</h2>
          <p className='text-gray-600 mb-6'>Please sign in to continue</p>

          {/* Error Placeholder */}
          <div className='bg-red-100 text-red-700 px-4 py-2 mb-4 rounded hidden'>
            Error message goes here
          </div>

          {/* Login Form */}
          <form>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                onChange={handleChange}
                value={credentials.email}
                type='email'
                name='email'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                name='password'
                onChange={handleChange}
                value={credentials.password}
                type='password'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200'
            >
              {loading ? (
                <CircularProgress size={'1.5rem'} color='inherit' />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
