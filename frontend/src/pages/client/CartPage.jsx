import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';

import { toast } from 'react-toastify';

import CustomBreedCrumb from '../../components/CustomBreedCrumb';
import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';
import cartService from '../../services/cart.service';

const CartPage = () => {
  const [cart, setCart] = useState();
  const cartItems = useMemo(() => cart?.cart?.cartItems || [], [cart]);
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectAll = () => {
    if (allItemsSelected) {
      setSelectedItems([]);
    } else {
      const allIds = cartItems.map((item) => item._id);
      setSelectedItems(allIds);
    }
  };

  const allItemsSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  const fetchCart = useCallback(async () => {
    const response = await cartService.getCartByUser(accessToken);
    setCart(response);
    console.log(response);
  }, [accessToken]);

  useEffect(() => {
    // dispatch(getCartByUser(accessToken));
    fetchCart();
  }, [accessToken, fetchCart]);

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giỏ hàng', href: '/cart' },
  ];

  const handleRemove = (id) => {
    // dispatch(
    //   deleteItem({
    //     accessToken: accessToken,
    //     id: id,
    //   })
    // );
  };

  const handleQuantityChange = (id, delta) => {
    if (delta <= 0) {
      handleRemove(id); // Xóa sản phẩm nếu số lượng bằng 0
    } else {
      //   dispatch(
      //     updateQuantity({
      //       accessToken: accessToken,
      //       data: { productId: id, quantity: delta },
      //     })
      //   );
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item._id))
      .reduce(
        (total, item) =>
          total +
          item.itemPrice *
            ((100 - item.product.discount?.discountPercent) / 100) *
            item.quantity,
        0
      );
  };

  return (
    <>
      <CustomBreedCrumb breadcrumbs={breadcrumbs} />
      <div className='container mx-auto px-4 py-5'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold'>Giỏ hàng của bạn</h2>
        </div>
        {cartItems.length === 0 ? (
          <div className='flex flex-col items-center'>
            <p className='text-center text-sm sm:text-lg text-gray-500'>
              Không có sản phẩm nào trong giỏ hàng của bạn
            </p>
          </div>
        ) : (
          <>
            <div className='hidden lg:block'>
              <table className='w-full bg-white rounded-lg shadow text-sm sm:text-base'>
                <thead className='bg-primary'>
                  <tr className='border-b text-white'>
                    <th className='text-left py-2 px-4'>Chọn</th>
                    <th className='text-left py-2 px-4'>Sản phẩm</th>
                    <th className='text-center py-2 px-4'>Số lượng</th>
                    <th className='text-right py-2 px-4'>Tổng giá</th>
                    <th className='text-center py-2 px-4'></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className='border-b'>
                      <td className='text-center py-2 px-4'>
                        <input
                          type='checkbox'
                          checked={selectedItems.includes(item._id)}
                          onChange={() => handleCheckboxChange(item._id)}
                          className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
                        />
                      </td>
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
                          <Link to={`/products/detail/${item.product._id}`}>
                            <p className='font-medium text-gray-900 hover:text-primary transition duration-150'>
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
                      <td className='text-right py-2 px-4 text-primary font-semibold'>
                        {/* {item.itemPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })} */}
                        {ToVietnamCurrencyFormat(item.itemPrice)}
                      </td>
                      <td className='text-center py-2 px-4'>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className='text-primary hover:text-hover-primary transition duration-150'
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
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                      className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-4'
                    />
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
                    <p className='text-primary font-semibold'>
                      {ToVietnamCurrencyFormat(item.itemPrice)}
                    </p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className='text-primary hover:text-hover-primary transition duration-150'
                    >
                      <DeleteForeverSharpIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className='container mx-auto p-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={allItemsSelected}
                  onChange={handleSelectAll}
                  className='form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out'
                />
                <span className='text-sm font-semibold'>
                  Chọn tất cả ({cartItems.length})
                </span>
              </label>
              {/* Other cart page content */}
            </div>

            {/* Total Price and Order Button */}
            <div className='flex flex-col items-end mt-6'>
              <div className='text-lg sm:text-xl font-semibold mb-4'>
                Tổng cộng:{' '}
                <span className='text-primary'>
                  {ToVietnamCurrencyFormat(calculateTotal())}
                </span>
              </div>
              <button
                // onClick={handleOrderNow}
                className='bg-primary hover:bg-hover-primary text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded transition duration-150'
              >
                Đặt hàng ngay
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
