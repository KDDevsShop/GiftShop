import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  GiftIcon,
  ListOrderedIcon,
} from 'lucide-react';
import authService from '../services/auth.service';

const navItems = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    path: '/dashboard',
  },
  { label: 'Users', icon: <Users size={18} />, path: '/admin/users' },
  {
    label: 'Product Types',
    icon: <Package size={18} />,
    path: '/product-type',
  },
  {
    label: 'Products',
    icon: <GiftIcon size={18} />,
    path: '/admin/products',
  },
  {
    label: 'Orders',
    icon: <ListOrderedIcon size={18} />,
    path: '/admin/orders',
  },
];

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    authService.logout().then(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    });
  };

  return (
    <aside className='w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm'>
      <div className='p-6 border-b border-gray-100'>
        <h2 className='text-xl font-bold text-indigo-600'>Admin Panel</h2>
      </div>
      <nav className='p-4 space-y-2'>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
              location.pathname === item.path
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className='mt-auto p-4 border-t border-gray-100'>
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 text-sm text-gray-500 hover:text-red-500'
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
