import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import cartService from '../services/cart.service';
import LoadingSpinner from './LoadingSpinner';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const accessToken = useMemo(() => localStorage.getItem('acccessToken'), []);

  useEffect(() => {
    // Fetch cart data when sidebar opens
    if (isOpen) {
      fetchCartData();
    }
  }, [isOpen]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = localStorage.getItem('user');
      if (!user) {
        setCart(null);
        setTotalItems(0);
        setTotalPrice(0);
        return;
      }

      const response = await cartService.getCartByUser(accessToken);
      console.log('Cart response:', response);

      // Update state with the cart data
      setCart(response.cart || null);
      setTotalItems(response.totalCartItems || 0);
      setTotalPrice(response.totalPrice || 0);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;

      setLoading(true);
      await cartService.updateCartItemQuantity(itemId, newQuantity);

      // Refetch cart data to get the updated totals
      fetchCartData();

      toast.success('Cart updated');
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setLoading(true);
      await cartService.removeCartItem(itemId);

      // Refetch cart data to get the updated totals
      fetchCartData();

      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/order');
  };

  // Format image URL
  const formatImageUrl = (path) => {
    if (!path) return '';

    return String(path).startsWith('http')
      ? path
      : `http://localhost:5000/${String(path).replace(/\\/g, '/')}`;
  };

  // Check if cart has items
  const hasItems = cart && cart.cartItems && cart.cartItems.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/50 z-40 text-black'
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-xl flex flex-col'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className='text-xl font-bold'>Your Cart</h2>
              <button
                onClick={onClose}
                className='p-2 rounded-full hover:bg-gray-100 transition-colors'
                aria-label='Close cart'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Cart content */}
            <div className='flex-1 overflow-y-auto p-4'>
              {loading && (
                <div className='flex justify-center py-8'>
                  <LoadingSpinner />
                </div>
              )}

              {error && (
                <div className='text-center py-8'>
                  <p className='text-red-500 mb-2'>{error}</p>
                  <button
                    onClick={fetchCartData}
                    className='text-purple-800 hover:underline'
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && !hasItems && (
                <div className='text-center py-12'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='mx-auto h-12 w-12 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                    />
                  </svg>
                  <p className='mt-4 text-gray-600'>Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className='mt-4 text-purple-800 hover:underline'
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              {!loading && !error && hasItems && (
                <ul className='divide-y divide-gray-200'>
                  {cart.cartItems.map((item) => (
                    <motion.li
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      layout
                      className='py-4'
                    >
                      <div className='flex items-center'>
                        <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                          <img
                            src={formatImageUrl(
                              item.product.productImagePath?.[0]
                            )}
                            alt={item.product.productName}
                            className='h-full w-full object-contain'
                          />
                        </div>

                        <div className='ml-4 flex-1'>
                          <Link
                            to={`/products/${item.product._id}`}
                            className='font-medium text-gray-900 hover:text-purple-800'
                            onClick={onClose}
                          >
                            {item.product.productName}
                          </Link>

                          <div className='text-sm text-gray-500'>
                            $
                            {item.itemPrice
                              ? (item.itemPrice / item.quantity).toFixed(2)
                              : item.product.price}{' '}
                            each
                          </div>

                          <div className='mt-1 flex items-center justify-between'>
                            <div className='flex items-center'>
                              <button
                                className='p-1 text-gray-500 hover:text-gray-700'
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1 || loading}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-4 w-4'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M20 12H4'
                                  />
                                </svg>
                              </button>
                              <span className='px-2 text-sm'>
                                {item.quantity}
                              </span>
                              <button
                                className='p-1 text-gray-500 hover:text-gray-700'
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  (item.product.countInStock &&
                                    item.quantity >=
                                      item.product.countInStock) ||
                                  loading
                                }
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-4 w-4'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 4v16m8-8H4'
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className='flex items-center'>
                              <span className='text-sm font-medium text-gray-900'>
                                $
                                {item.itemPrice
                                  ? item.itemPrice.toFixed(2)
                                  : (
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                              </span>
                              <button
                                className='ml-4 text-red-500 hover:text-red-700'
                                onClick={() => handleRemoveItem(item._id)}
                                disabled={loading}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-5 w-5'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {!loading && !error && hasItems && (
              <div className='border-t p-4'>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Items</span>
                  <span className='font-medium'>{totalItems}</span>
                </div>

                <div className='flex justify-between mb-4 text-lg font-medium'>
                  <span>Total</span>
                  <span className='font-bold text-purple-800'>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <button
                    onClick={handleCheckout}
                    className='w-full bg-purple-800 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition duration-150'
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size='sm' color='white' />
                    ) : (
                      'Checkout'
                    )}
                  </button>
                  <Link
                    to={'/cart'}
                    className='w-full bg-purple-800 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-bold transition duration-150'
                  >
                    Go to cart
                  </Link>
                </div>

                <button
                  onClick={onClose}
                  className='w-full mt-2 text-purple-800 hover:underline py-2'
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartSidebar;
