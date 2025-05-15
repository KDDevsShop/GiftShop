import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';

import CustomBreedCrumb from '../../components/CustomBreedCrumb';
import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';
import cartService from '../../services/cart.service';

const CartPage = () => {
  const [cart, setCart] = useState();
  const cartItems = useMemo(() => cart?.cart?.cartItems || [], [cart]);
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    const response = await cartService.getCartByUser(accessToken);
    setCart(response);
    console.log(response);
  }, [accessToken]);

  useEffect(() => {
    fetchCart();
  }, [accessToken, fetchCart]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
  ];

  const handleRemove = async (id) => {
    await cartService.deleteItem(accessToken, id);
    fetchCart();
  };

  const handleQuantityChange = async (id, delta) => {
    if (delta <= 0) {
      handleRemove(id); // Xóa sản phẩm nếu số lượng bằng 0
      fetchCart();
    } else {
      //   dispatch(
      //     updateQuantity({
      //       accessToken: accessToken,
      //       data: { productId: id, quantity: delta },
      //     })
      //   );
      await cartService.updateQuantity(accessToken, {
        productId: id,
        quantity: delta,
      });
      fetchCart();
    }
  };

  const handleOrderNow = () => {
    sessionStorage.setItem('selectedProductIds', JSON.stringify(cartItems));
    setTimeout(() => navigate('/order'), 1000);
  };

  return (
    <>
      <CustomBreedCrumb breadcrumbs={breadcrumbs} />
      <div className='container mx-auto px-4 py-5'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold'>Your cart</h2>
        </div>
        {cartItems.length === 0 ? (
          <div className='flex flex-col items-center'>
            <p className='text-center text-sm sm:text-lg text-gray-500'>
              There's no products in your cart
            </p>
          </div>
        ) : (
          <>
            <div className='hidden lg:block'>
              <table className='w-full bg-white rounded-lg shadow text-sm sm:text-base'>
                <thead className='bg-purple-800'>
                  <tr className='border-b text-white'>
                    <th className='text-left py-2 px-4'>Product</th>
                    <th className='text-center py-2 px-4'>Quantity</th>
                    <th className='text-right py-2 px-4'>Price</th>
                    <th className='text-center py-2 px-4'></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className='border-b'>
                      <td className='flex items-center py-2 px-4'>
                        <img
                          // src={item.product.productImagePath?.[0] || ''}
                          src={
                            String(
                              item.product.productImagePath?.[0]
                            ).startsWith('http')
                              ? item.product.productImagePath?.[0]
                              : `http://localhost:5000/${String(
                                  item.product.productImagePath?.[0]
                                ).replace(/\\/g, '/')}`
                          }
                          alt={item.product.productName}
                          className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded mr-4'
                        />
                        <div>
                          <Link to={`/products/${item.product._id}`}>
                            <p className='font-medium text-gray-900 hover:text-purple-800 transition duration-150'>
                              {item.product.productName}
                            </p>
                          </Link>
                        </div>
                      </td>
                      <td className='text-center py-2 px-4'>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-l-full transition duration-150'
                        >
                          <span>-</span>
                        </button>
                        <span className='mx-2 sm:mx-3'>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-r-full transition duration-150'
                        >
                          <span>+</span>
                        </button>
                      </td>
                      <td className='text-right py-2 px-4 text-purple-800 font-semibold'>
                        $ {item.itemPrice}
                      </td>
                      <td className='text-center py-2 px-4'>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className='text-red-600 hover:text-hover-purple-800 transition duration-150'
                        >
                          <DeleteForeverSharpIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className='block lg:hidden'>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className='flex flex-col border-b py-4 mb-4'
                >
                  {/* Product Image */}
                  <div className='flex items-center mb-4'>
                    <img
                      src={item.product?.productImagePath?.[0] || ''}
                      alt={item.product.productName}
                      className='w-16 h-16 object-cover rounded'
                    />
                    <div className='ml-4'>
                      <Link to={`/products/detail/${item.product._id}`}>
                        <p className='font-medium text-base text-gray-900 hover:text-blue-600 transition duration-150'>
                          {item.product?.productName}
                        </p>
                      </Link>
                    </div>
                  </div>

                  {/* Product Details and Quantity */}
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-l-full transition duration-150'
                      >
                        <span>-</span>
                      </button>
                      <span className='mx-2'>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-r-full transition duration-150'
                      >
                        <span>+</span>
                      </button>
                    </div>
                    <p className='text-purple-800 font-semibold'>
                      {ToVietnamCurrencyFormat(item.itemPrice)}
                    </p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className='text-purple-800 hover:text-hover-purple-800 transition duration-150'
                    >
                      <DeleteForeverSharpIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Price and Order Button */}
            <div className='flex flex-col items-end mt-6'>
              <div className='text-lg sm:text-xl font-semibold mb-4'>
                Total:{' '}
                <span className='text-purple-800'>$ {cart?.totalPrice}</span>
              </div>
              <button
                onClick={handleOrderNow}
                className='bg-purple-800 hover:bg-hover-purple-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded transition duration-150 cursor-pointer hover:bg-purple-700'
              >
                Order Now
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
