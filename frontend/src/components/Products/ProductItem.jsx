import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';

const ProductItem = ({ product }) => {
  const formattedPrice = ToVietnamCurrencyFormat(product?.price || 0);

  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100 group'>
      <div className='relative w-full h-52 md:h-64 lg:h-72 overflow-hidden'>
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
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
        </Link>

        {/* Badge for new products or discounts */}
        {product?.isNew && (
          <div className='absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full'>
            New
          </div>
        )}
      </div>

      <div className='p-5 flex flex-col justify-between h-44'>
        <div>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-gray-600 text-xs font-medium uppercase tracking-wider'>
              {product?.productType && (
                <span>{product?.productType?.productTypeName}</span>
              )}
            </p>
          </div>

          <Link to={`/products/${product?._id}`}>
            <h3 className='text-base md:text-lg text-gray-900 font-semibold mb-2 hover:text-primary transition-colors line-clamp-1'>
              {product?.productName}
            </h3>
          </Link>
        </div>

        <div className='space-y-2'>
          {product?.traits && product?.traits.length > 0 && (
            <p className='text-gray-500 text-xs line-clamp-1'>
              <span className='font-medium'>Traits:</span>{' '}
              {product?.traits?.join(', ')}
            </p>
          )}

          {product?.recommendedTypes &&
            product?.recommendedTypes.length > 0 && (
              <p className='text-gray-500 text-xs line-clamp-1'>
                <span className='font-medium'>For:</span>{' '}
                {product?.recommendedTypes.join(', ')}
              </p>
            )}

          <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
            <p className='text-primary font-bold text-base md:text-lg'>
              {formattedPrice}
            </p>
          </div>
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
    isNew: PropTypes.bool,
  }).isRequired,
};

export default ProductItem;
