import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', color = 'purple' }) => {
  // Size configurations
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  // Color configurations
  const colors = {
    purple: 'border-purple-800',
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
  };

  return (
    <div className='flex justify-center items-center'>
      <motion.div
        className={`${sizes[size]} border-4 border-gray-200 rounded-full ${colors[color]} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        role='status'
        aria-label='Loading'
      />
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['purple', 'blue', 'gray', 'white']),
};

LoadingSpinner.defaultProps = {
  size: 'md',
  color: 'purple',
};

export default LoadingSpinner;
