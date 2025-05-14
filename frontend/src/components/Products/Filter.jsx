import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Filter = ({ onTypeChange, onRecommendedChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [recommendedTypes] = useState([
    'ISTJ',
    'ISFJ',
    'INFJ',
    'INTJ',
    'ISTP',
    'ISFP',
    'INFP',
    'INTP',
    'ESTP',
    'ESFP',
    'ENFP',
    'ENTP',
    'ESTJ',
    'ESFJ',
    'ENFJ',
    'ENTJ',
  ]);

  useEffect(() => {
    onTypeChange(selectedTypes);
  }, [selectedTypes, onTypeChange]);

  useEffect(() => {
    onRecommendedChange(selectedRecommendations);
  }, [selectedRecommendations, onRecommendedChange]);

  const handleSelectionChange = (value, setSelected) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedRecommendations([]);
  };

  return (
    <div className='w-full p-6 bg-gray-50 shadow-lg rounded-lg'>
      <h1 className='text-3xl text-purple-800 font-semibold text-center mb-8'>
        Filter
      </h1>

      {/* Recommended Types */}
      <h3 className='text-lg font-semibold my-4'>Recommended Types</h3>
      {recommendedTypes.map((type) => (
        <label key={type} className='block text-sm text-gray-700 mb-2'>
          <input
            type='checkbox'
            className='mr-2 transform scale-125'
            checked={selectedRecommendations.includes(type)}
            onChange={() =>
              handleSelectionChange(
                type,
                setSelectedRecommendations,
                selectedRecommendations
              )
            }
          />
          {type}
        </label>
      ))}

      <button
        className='mt-6 px-4 py-2 bg-primary hover:bg-hover-primary text-white rounded-lg'
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

Filter.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
  onRecommendedChange: PropTypes.func.isRequired,
};

export default Filter;
