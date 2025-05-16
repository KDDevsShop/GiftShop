import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

const Header = () => {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  return (
    <nav className='bg-purple-600 py-4 text-white shadow-lg'>
      <div className='container mx-auto flex items-center justify-between px-4'>
        {/* Logo / Brand */}
        <Link to='/' className='text-2xl font-bold text-white'>
          Gift Discovery
        </Link>

        {/* Navigation Links */}
        <ul className='flex items-center space-x-8'>
          <li>
            <Link
              to='/'
              className='text-white hover:opacity-80 transition-opacity'
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to='/products'
              className='text-white hover:opacity-80 transition-opacity'
            >
              Gift
            </Link>
          </li>
          <li>
            <Link
              to='/mbti-test'
              className='bg-purple-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-500 transition-all'
            >
              Find Your Perfect Gift
            </Link>
          </li>

          {/* User Navigation */}
          {user ? (
            <>
              <li>
                <Link to={'/cart'}>
                  <FaCartShopping />
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigate('/me')}
                  className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 font-semibold cursor-pointer overflow-hidden'
                >
                  {user.avatarImagePath ? (
                    <img
                      src={`http://localhost:5000/${user.avatarImagePath}`}
                      alt='User Avatar'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    user.fullname.charAt(0).toUpperCase()
                  )}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to='/login'
                  className='text-white hover:opacity-80 transition-opacity'
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='bg-white text-purple-600 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 transition-all'
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
