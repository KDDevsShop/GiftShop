import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const Filter = ({
  onTypeChange,
  onRecommendedChange,
  allProducts,
  selectedTypes,
  selectedRecommendations,
}) => {
  const availableProductTypes = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const types = allProducts
      .map((product) => product.productType?.productTypeName)
      .filter(Boolean);

    return [...new Set(types)].sort();
  }, [allProducts]);

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

  const handleSelectionChange = (value, setSelected, currentSelected) => {
    const newSelection = currentSelected.includes(value)
      ? currentSelected.filter((item) => item !== value)
      : [...currentSelected, value];

    setSelected(newSelection);
  };

  const clearFilters = () => {
    onTypeChange([]);
    onRecommendedChange([]);
  };

  const getTypeCount = (type) => {
    return allProducts.filter(
      (product) => product.productType?.productTypeName === type
    ).length;
  };

  const getRecommendedTypeCount = (type) => {
    return allProducts.filter((product) =>
      product.recommendedTypes?.includes(type)
    ).length;
  };

  return (
    <div className='w-full p-6 bg-gray-50 shadow-lg rounded-lg'>
      <h1 className='text-3xl text-purple-800 font-semibold text-center mb-8'>
        Filter
      </h1>

      {/* Product Types */}
      {availableProductTypes.length > 0 && (
        <>
          <h3 className='text-lg font-semibold my-4 flex items-center'>
            <span>Product Types</span>
            <span className='ml-2 text-xs text-gray-500'>
              ({availableProductTypes.length})
            </span>
          </h3>
          <div className='max-h-48 overflow-y-auto mb-6 pr-2'>
            {availableProductTypes.map((type) => (
              <label
                key={type}
                className='flex items-center justify-between text-sm text-gray-700 mb-2 hover:bg-gray-100 p-1 rounded cursor-pointer'
              >
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='mr-2 transform scale-125 accent-purple-600'
                    checked={selectedTypes.includes(type)}
                    onChange={() =>
                      handleSelectionChange(type, onTypeChange, selectedTypes)
                    }
                  />
                  <span>{type}</span>
                </div>
                <span className='text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full'>
                  {getTypeCount(type)}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      {/* Recommended Types */}
      <h3 className='text-lg font-semibold my-4 flex items-center'>
        <span>Personality Types</span>
      </h3>
      <div className='grid grid-cols-2 gap-1 max-h-60 overflow-y-auto mb-6'>
        {recommendedTypes.map((type) => (
          <label
            key={type}
            className='flex items-center justify-between text-sm text-gray-700 mb-2 hover:bg-gray-100 p-1 rounded cursor-pointer'
          >
            <div className='flex items-center'>
              <input
                type='checkbox'
                className='mr-2 transform scale-125 accent-purple-600'
                checked={selectedRecommendations.includes(type)}
                onChange={() =>
                  handleSelectionChange(
                    type,
                    onRecommendedChange,
                    selectedRecommendations
                  )
                }
              />
              <span>{type}</span>
            </div>
            <span className='text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full'>
              {getRecommendedTypeCount(type)}
            </span>
          </label>
        ))}
      </div>

      {/* Active Filters */}
      {(selectedTypes.length > 0 || selectedRecommendations.length > 0) && (
        <div className='mt-6 mb-4'>
          <h3 className='text-sm font-semibold mb-2'>Active Filters:</h3>
          <div className='flex flex-wrap gap-2'>
            {selectedTypes.map((type) => (
              <span
                key={type}
                className='bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center'
              >
                {type}
                <button
                  className='ml-1'
                  onClick={() =>
                    handleSelectionChange(type, onTypeChange, selectedTypes)
                  }
                >
                  ×
                </button>
              </span>
            ))}
            {selectedRecommendations.map((type) => (
              <span
                key={type}
                className='bg-purple-400 text-white text-xs px-2 py-1 rounded-full flex items-center'
              >
                {type}
                <button
                  className='ml-1'
                  onClick={() =>
                    handleSelectionChange(
                      type,
                      onRecommendedChange,
                      selectedRecommendations
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        className='mt-6 w-full px-4 py-2 bg-primary hover:bg-hover-primary text-white rounded-lg transition-colors'
        onClick={clearFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
};

Filter.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
  onRecommendedChange: PropTypes.func.isRequired,
  allProducts: PropTypes.array,
  selectedTypes: PropTypes.array.isRequired,
  selectedRecommendations: PropTypes.array.isRequired,
};

Filter.defaultProps = {
  allProducts: [],
};

export default Filter;
