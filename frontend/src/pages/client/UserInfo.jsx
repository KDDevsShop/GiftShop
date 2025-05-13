const UserInfo = () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='bg-white shadow-lg rounded-xl p-8 max-w-sm w-full text-center'>
        {/* Avatar */}
        <div className='w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500 mb-6'>
          <img
            src={
              userData.avatarImagePath ||
              'https://via.placeholder.com/150?text=No+Avatar'
            }
            alt={userData.fullname}
            className='w-full h-full object-cover'
          />
        </div>

        {/* User Details */}
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>
          {userData.fullname}
        </h2>

        <p className='text-gray-600 mb-2 text-left'>
          <span className='font-semibold text-blue-500'>Email:</span>{' '}
          {userData.email}
        </p>
        <p className='text-gray-600 mb-2 text-left'>
          <span className='font-semibold text-blue-500'>Phone:</span>{' '}
          {userData.phone}
        </p>
        <p className='text-gray-600 mb-2 text-left'>
          <span className='font-semibold text-blue-500'>Address:</span>
          {userData.address.length > 0
            ? userData.address.join(', ')
            : 'No address provided'}
        </p>
        <p className='text-gray-600 mb-2 text-left'>
          <span className='font-semibold text-blue-500'>Social Login:</span>
          {userData.isSocialLogin ? 'Yes' : 'No'}
        </p>
        <p className='text-gray-600 text-left'>
          <span className='font-semibold text-blue-500'>Last Updated:</span>
          {new Date(userData.updatedAt).toLocaleString()}
        </p>

        {/* Action Buttons */}
        <div className='mt-6 space-x-3'>
          <button className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition'>
            Edit Profile
          </button>
          <button className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
