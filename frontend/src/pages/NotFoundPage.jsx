import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='text-center flex justify-center items-center flex-col w-screen h-screen'>
      <h1 className='text-purple-800 text-4xl font-bold mb-2 uppercase'>
        404 - Page Not Found
      </h1>
      <p className='text-purple-800 text-2xl mb-6'>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to='/'
        className='mt-3 bg-purple-800 text-white px-8 py-2 rounded-lg hover:bg-purple-700'
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
