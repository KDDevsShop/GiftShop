import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock API call
  useEffect(() => {
    setLoading(true);
    let gifts = [];

    try {
      setTimeout(() => {}, 3000);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }

    return () => clearTimeout();
  }, []);

  if (loading)
    return (
      <div className='flex justify-center py-20'>
        <CircularProgress />
      </div>
    );
  if (error)
    return <div className='text-center text-red-600 py-20'>{error}</div>;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {/* Hero Section */}
      <section className='flex flex-col md:flex-row items-center gap-8 mb-16'>
        <div className='flex-1'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            Discover the Perfect Gift Based on Personality
          </h1>
          <p className='text-lg text-gray-600 mb-6'>
            Take our MBTI personality test to find gifts that truly match the
            recipient's unique traits and preferences.
          </p>
          <div className='flex gap-4 flex-wrap'>
            <button
              className='bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all cursor-pointer'
              onClick={() => navigate('/mbti-test')}
            >
              Take Personality Test
            </button>
            <button
              className='border-2 border-purple-600 text-purple-600 py-2 px-6 rounded-lg hover:bg-purple-100 transition-all cursor-pointer'
              onClick={() =>
                window.scrollTo({
                  top: document.querySelector('.how-it-works').offsetTop,
                  behavior: 'smooth',
                })
              }
            >
              Learn How It Works
            </button>
          </div>
        </div>
        <div className='flex-1'>
          <img
            src='/images/hero-banner.jpg'
            alt='Personality-based gift discovery'
            className='rounded-lg shadow-lg cursor-pointer hover:scale-105 hover:opacity-95'
            onClick={() => navigate('/products')}
          />
        </div>
      </section>

      {/* How It Works Section */}
      {/* How It Works Section */}
      <section className='how-it-works mb-16 bg-gray-50 py-12 px-4 rounded-lg'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>
          How It Works
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Step 1 */}
          <div className='bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2'>
            <div className='w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold'>
              1
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Take the Test
            </h3>
            <p className='text-gray-600'>
              Answer questions about preferences and behaviors to determine your
              MBTI personality type.
            </p>
          </div>

          {/* Step 2 */}
          <div className='bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2'>
            <div className='w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold'>
              2
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Get Your Results
            </h3>
            <p className='text-gray-600'>
              Discover your personality type and learn about your unique traits
              and preferences.
            </p>
          </div>

          {/* Step 3 */}
          <div className='bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2'>
            <div className='w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold'>
              3
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Browse Recommendations
            </h3>
            <p className='text-gray-600'>
              Explore gift suggestions tailored specifically to your personality
              type.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      {/* <section className='mb-16'>
        <div className='flex items-center mb-6'>
          <input
            type='text'
            placeholder='Search for gifts...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-grow py-2 px-4 border-2 border-gray-300 rounded-l-lg focus:outline-none'
          />
          <button className='bg-purple-600 text-white py-2 px-4 rounded-r-lg flex items-center gap-2 cursor-pointer'>
            <SearchIcon /> Search
          </button>
        </div>
        <div className='flex flex-wrap gap-2 mb-8'>
          {categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              className='cursor-pointer bg-gray-100 hover:bg-gray-200'
            />
          ))}
        </div>
      </section> */}

      {/* Gift Cards */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {gifts.map((gift) => (
          <Card key={gift.id} className='shadow-lg rounded-lg overflow-hidden'>
            <CardMedia
              component='img'
              height='200'
              image={gift.imageUrl}
              alt={gift.name}
            />
            <CardContent>
              <h3 className='text-xl font-semibold text-gray-800'>
                {gift.name}
              </h3>
              <p className='text-lg font-bold text-purple-600'>${gift.price}</p>
            </CardContent>
            <CardActions>
              <Link
                to={`/gift/${gift.id}`}
                className='ml-4 mb-2 text-purple-600 hover:text-purple-800'
              >
                View Details
              </Link>
            </CardActions>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
