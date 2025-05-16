import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ThankYouPage = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 p-6'>
      <div className='bg-white shadow-lg rounded-lg p-10 md:p-14 max-w-xl w-full text-center m-5'>
        <CheckCircleIcon
          className='text-green-500 mb-4'
          style={{ fontSize: '4rem' }}
        />
        <h1 className='text-3xl font-extrabold text-gray-800 mb-4'>
          Thank for your order!
        </h1>
        <p className='text-gray-600 mb-6'>
          Your order is being processed. We'll inforn when your order is
          delivered. You can check you order information anytime. Thank you!
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          <Link
            to='/me?tab=orders'
            className='bg-purple-800 hover:bg-purple-700 text-white py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out'
          >
            View order history
          </Link>
          <Link
            to='/'
            className='bg-gray-500 hover:bg-gray-600 text-white py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out'
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
