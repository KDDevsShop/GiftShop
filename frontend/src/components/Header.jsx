import React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  return (
    <header className='bg-white shadow-sm px-6 py-4 flex items-center justify-between'>
      {/* Logo / Title */}
      <div className='text-xl font-bold text-indigo-600'>🎁 GiftApp</div>

      {/* Navigation - Add more links if needed */}
      <nav className='hidden md:flex space-x-6 text-sm text-gray-600'>
        <a href='/' className='hover:text-indigo-600'>
          Home
        </a>
        <a href='#' className='hover:text-indigo-600'>
          Gifts
        </a>
        <a href='#' className='hover:text-indigo-600'>
          Contact
        </a>
      </nav>

      {/* User avatar */}
      <button
        onClick={() => navigate('/me')}
        className='w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold cursor-pointer'
      >
        {user.fullname.charAt(0).toUpperCase()}
      </button>
    </header>
  );
};

export default Header;
