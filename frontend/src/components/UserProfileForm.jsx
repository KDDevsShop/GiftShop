import { useEffect, useRef, useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import userService from '../services/user.service';
import { CircularProgress } from '@mui/material';
import { useCallback } from 'react';
import dayjs from 'dayjs';

function UserProfileForm() {
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const accessToken = localStorage.getItem('accessToken');

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
  );
  // const [avatarUpdated, setAvatarUpdated] = useState(false); // Trạng thái theo dõi avatar đã cập nhật
  const fileInputRef = useRef(null);

  const fetchLoggedInUser = useCallback(async () => {
    const res = await userService.getLoggedInUser(accessToken);
    setUserData({
      ...res,
      dateOfBirth: dayjs(res.dateOfBirth).format('YYYY-MM-DD'),
    });
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchLoggedInUser();
    }
  }, [accessToken, fetchLoggedInUser]);

  // Cập nhật thông tin người dùng và preview avatar khi người dùng thay đổi
  useEffect(() => {
    if (user) {
      const formattedDateOfBirth = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '';

      setUserData({
        email: user.email || '',
        fullName: user.fullname || '',
        phoneNumber: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: formattedDateOfBirth,
      });

      // Nếu người dùng đã có avatar thì hiển thị ảnh từ server
      setAvatarPreview(
        user?.avatarImagePath
          ? user?.avatarImagePath.startsWith('http')
            ? user?.avatarImagePath
            : `http://localhost:5000/${user?.avatarImagePath.replace(
                /\\/g,
                '/'
              )}`
          : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
      );
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);

      // Hiển thị avatar preview ngay lập tức
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAvatar = async () => {
    if (!avatarFile) {
      toast.error('Vui lòng chọn ảnh đại diện');

      return;
    }

    try {
      //   await dispatch(changeAvatarThunk({ avatarFile, accessToken }));

      toast.success('Đổi ảnh đại diện thành công');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset giá trị của input file
      }
      // setAvatarUpdated(true); // Đánh dấu rằng avatar đã được cập nhật
    } catch (error) {
      console.log(error);
      toast.error('Đổi ảnh đại diện thất bại');
    }
    // dispatch(getLoggedInUser(accessToken));
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const updatedData = {
      email: userData.email,
      fullname: userData.fullName,
      phone: userData.phoneNumber,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
    };

    try {
      await userService.updateUserInfo(updatedData, accessToken);
      toast.success('Cập nhật thông tin tài khoản thành công');
      userService.getLoggedInUser(accessToken);
    } catch (error) {
      console.log(error);

      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }

    // dispatch(getLoggedInUser(accessToken));
  };

  const fieldLabels = {
    email: 'Email',
    fullName: 'Họ và tên',
    phoneNumber: 'Số điện thoại',
    gender: 'Giới tính',
    dateOfBirth: 'Ngày sinh',
  };

  return (
    <form onSubmit={handleSubmit} className=''>
      <div className='flex items-center mb-4'>
        <div className='relative'>
          <img
            src={avatarPreview}
            alt='Avatar Preview'
            className='w-32 h-32 object-cover rounded-full border-2 border-gray-300'
          />

          <label
            htmlFor='avatar'
            className='absolute bottom-1 right-1 bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200 transition'
          >
            <input
              type='file'
              id='avatar'
              ref={fileInputRef}
              accept='image/*'
              onChange={handleAvatarChange}
              className='hidden'
            />
            <CameraAltIcon className='text-gray-700' fontSize='small' />
          </label>
        </div>
        <button
          type='button'
          onClick={handleChangeAvatar}
          className='ml-4 bg-purple-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700'
        >
          Đổi ảnh đại diện
        </button>
      </div>
      {['email', 'fullName', 'phoneNumber', 'gender', 'dateOfBirth'].map(
        (field) => (
          <div key={field} className='mb-4'>
            <label
              htmlFor={field}
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              {fieldLabels[field]}:
            </label>
            {field === 'gender' ? (
              <select
                id={field}
                name={field}
                value={userData[field]}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              >
                <option value=''>Chọn giới tính</option>
                <option value='male'>Nam</option>
                <option value='female'>Nữ</option>
              </select>
            ) : (
              <input
                type={field === 'dateOfBirth' ? 'date' : 'text'}
                id={field}
                name={field}
                value={userData[field]}
                onChange={handleChange}
                className='shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                required
              />
            )}
          </div>
        )
      )}

      <button
        type='submit'
        className='bg-purple-800 hover:bg-hover-purpbg-purple-800 w-full text-white font-bold p-3 rounded cursor-pointer hover:bg-purple-700'
      >
        {loading ? (
          <CircularProgress size={'1.2rem'} color='inherit' />
        ) : (
          'Cập nhật'
        )}
      </button>
    </form>
  );
}

export default UserProfileForm;
