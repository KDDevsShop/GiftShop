import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';

const ProductItem = ({ product }) => {
  const formattedPrice = ToVietnamCurrencyFormat(product?.price || 0);

  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105'>
      <div className='flex justify-center items-center w-full h-48 md:h-64 lg:h-72 overflow-hidden'>
        <Link to={`/products/${product?._id}`}>
          <img
            src={
              product?.productImagePath && product?.productImagePath?.length > 0
                ? `http://localhost:5000/${product?.productImagePath[0]?.replace(
                    /\\/g,
                    '/'
                  )}`
                : '/default-product-image.jpg'
            }
            alt={product?.productName}
            className='w-full h-full object-cover rounded-t-2xl'
          />
        </Link>
      </div>

      <div className='p-4 flex flex-col justify-between h-40'>
        <Link to={`/products/${product?._id}`}>
          <h3 className='text-base md:text-lg text-gray-900 font-semibold mb-2 line-clamp-2'>
            {product?.productName}
          </h3>
        </Link>
        <p className='text-gray-600 text-sm mb-1'>
          {product?.productType && (
            <span>{product?.productType?.productTypeName}</span>
          )}
        </p>
        {product?.traits && product?.traits.length > 0 && (
          <p className='text-gray-500 text-xs mb-2 line-clamp-1'>
            Traits: {product?.traits?.join(', ')}
          </p>
        )}
        {product?.recommendedTypes && product?.recommendedTypes.length > 0 && (
          <p className='text-gray-500 text-xs mb-3 line-clamp-1'>
            Recommended for: {product?.recommendedTypes.join(', ')}
          </p>
        )}
        <div className='flex items-center justify-between'>
          <p className='text-primary font-bold text-base md:text-lg'>
            {formattedPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    productName: PropTypes.string.isRequired,
    productImagePath: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number.isRequired,
    productType: PropTypes.shape({
      productTypeName: PropTypes.string.isRequired,
    }),
    recommendedTypes: PropTypes.arrayOf(PropTypes.string),
    traits: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductItem;
