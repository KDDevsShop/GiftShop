import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Correct import statement
import {
  AccountCircle,
  LocationOn,
  Lock,
  // Notifications,
  ShoppingCart,
} from '@mui/icons-material'; // Import icons from Material UI
import UserProfileForm from '../../components/UserProfileForm';
import { FiLogOut } from 'react-icons/fi';
import authService from '../../services/auth.service.js';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const user = JSON.parse(localStorage.getItem('user'));
  // const accessToken = localStorage.getItem('accessToken');

  // useEffect(() => {
  //   if (accessToken) {
  //     dispatch(getLoggedInUser(accessToken));
  //   }
  // }, [dispatch, accessToken]);

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: 'profile', label: 'Hồ Sơ', icon: <AccountCircle /> },
    { id: 'address', label: 'Địa Chỉ', icon: <LocationOn /> },
    // { id: 'change-password', label: 'Đổi Mật Khẩu', icon: <Lock /> },
    { id: 'orders', label: 'Đơn Mua', icon: <ShoppingCart /> },
    // { id: 'vouchers', label: 'Kho Vouchers', icon: <Gift /> },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <UserProfileForm />;
      // case 'address':
      //   return <AddressSection />;
      // case 'change-password':
      //   return <PasswordResetForm />;
      // case 'orders':
      //   return <OrderHistory />;
      // case 'vouchers':
      //   return <VoucherManager />;
      default:
        return <UserProfileForm />;
    }
  };

  const handleLogout = () => {
    console.log('logged out!');
    authService.logout().then(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/');
    });
  };

  return (
    <div className='container mx-auto py-6 px-4'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Sidebar */}
        <div className='w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md'>
          <div className='text-center mb-4'>
            <img
              src={
                user && user?.avatarImagePath
                  ? user?.avatarImagePath.startsWith('http')
                    ? user?.avatarImagePath
                    : `http://localhost:5000/${user?.avatarImagePath.replace(
                        /\\/g,
                        '/'
                      )}`
                  : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
              }
              alt='User avatar'
              className='mx-auto rounded-full mb-2 size-24 border-2 border-purple800bg-purple-800'
            />
            <p className='text-lg font-bold'>{user?.fullname}</p>
            <button
              className='text-blue-500 cursor-pointer hover:underline hover:text-blue-400'
              onClick={() => setSelectedTab('profile')}
            >
              Sửa Hồ Sơ
            </button>
          </div>
          <ul className='space-y-3 mt-12'>
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                    selectedTab === tab.id
                      ? 'bg-purple-800 text-white hover:bg-purple-700'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTab(tab.id)}
                >
                  {tab.icon} <span>{tab.label}</span>
                </button>
              </li>
            ))}
            <hr className='text-gray-300 my-3' />
            <li key={'logout'}>
              <button
                className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded-lg cursor-pointer text-red-600 hover:text-white hover:bg-red-600 transition-all`}
                onClick={handleLogout}
              >
                <FiLogOut /> <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className='w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
