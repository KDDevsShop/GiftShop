import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressFormDialog from '../../components/AddressFormDialog';
import { toast } from 'react-toastify';
import { Gift } from 'lucide-react';

import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';
import cartService from '../../services/cart.service';
import orderService from '../../services/order.service';
import CustomBreedCrumb from '../../components/CustomBreedCrumb';
import addressService from '../../services/address.service';
import userService from '../../services/user.service';

function OrderPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    email: '',
    notes: '',
  });
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  // const selectedProductIds = useSelector(state => state.cart.selectedProduct);
  const selectedProductIds = useMemo(
    () => JSON.parse(sessionStorage.getItem('selectedProductIds') || []),
    []
  );
  console.log('productIds: ', selectedProductIds);

  const [productItems, setProductItems] = useState([]);

  useEffect(() => {
    const fetchCartDetail = async () => {
      const product = [];
      selectedProductIds.forEach(async (id) => {
        console.log('hehe: ', id);
        try {
          const data = await cartService.getCartDetail(id._id);
          console.log(data);
          product.push(data);
        } catch (error) {
          console.error(error);
        }
      });

      const response = await userService.getLoggedInUser(accessToken);

      setUser(response);
      setProductItems(product);
    };

    fetchCartDetail();
  }, [accessToken, selectedProductIds]);

  console.log(productItems);

  const fetchUserAddress = useCallback(async () => {
    const response = await addressService.getUserAddress(accessToken);
    setAddresses(response);
  }, [accessToken]);

  useEffect(() => {
    fetchUserAddress();
    // dispatch(getUserAddressThunk(accessToken));
  }, [fetchUserAddress]);

  useEffect(() => {
    const defaultAddress = addresses?.find((address) => address.isDefault);
    setSelectedAddress(defaultAddress);
    if (user) {
      setFormData({
        fullname: defaultAddress?.fullname || '',
        phone: defaultAddress?.phone || '',
        address: defaultAddress
          ? `${defaultAddress.detail}, ${defaultAddress.commune}, ${defaultAddress.district}, ${defaultAddress.province}`
          : '',
        email: user.email || '',
        notes: '',
      });
    }
  }, [user, addresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressSelect = (index) => {
    const selectedAddress = addresses[index];
    setSelectedAddress(selectedAddress);
    if (selectedAddress) {
      setFormData({
        ...formData,
        address: `${selectedAddress.detail}, ${selectedAddress.commune}, ${selectedAddress.district}, ${selectedAddress.province}`,
        fullname: selectedAddress.fullname || formData.fullname,
        phone: selectedAddress.phone || formData.phone,
      });
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const { fullname, phone, address, email } = formData;

    // Kiểm tra nếu các trường cần thiết (trừ 'notes') không được điền
    if (!fullname || !phone || !address || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const order = {
      orderDetail: selectedProductIds,
      totalPrice: calculateTotal(),
      shippingAddress: selectedAddress._id,
    };
    try {
      setIsLoading(true);
      const response = await orderService.createOrder(order);
      if (response) {
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        } else {
          toast.success('Đặt hàng thành công!');
          navigate('/thankyou');
        }
      }
      //   dispatch(getCartByUser(localStorage.getItem('accessToken')));
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return productItems.reduce((total, item) => {
      return total + item.itemPrice;
    }, 0);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Order' },
  ];

  const [open, setOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const handleClickOpen = (index = null) => {
    if (index !== null) {
      setEditAddress(addresses[index]);
    } else setEditAddress({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomBreedCrumb breadcrumbs={breadcrumbs} />
      <div className='bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            {/* Thông tin liên hệ và giao hàng */}
            <div className='bg-white shadow-lg rounded-lg p-6 lg:col-span-2'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Order Information
              </h2>
              <div className='mt-4'>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='p-3 bg-purple-800 text-white rounded focus:outline-none focus:ring-2  hover:bg-purple-700 cursor-pointer'
                >
                  Select an address
                </button>
                <input
                  type='text'
                  name='fullname'
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder='Fullname'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  readOnly
                />
                <input
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Phone number'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  readOnly
                />
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Address'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  readOnly
                />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  readOnly
                />
                <textarea
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder='Note'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  rows='4'
                />
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className='bg-white shadow-lg rounded-lg p-6 lg:col-span-3'>
              <div className='border-t'>
                {/* chi tiet don hang */}
                <h2 className='text-lg font-semibold text-gray-900 mt-4'>
                  Order Detail
                </h2>
                <div className='mt-4'>
                  {productItems.map((item) => (
                    <div key={item._id} className='flex flex-col'>
                      {/* Hiển thị sản phẩm chính */}
                      <div className='flex items-center space-x-4 py-2'>
                        <img
                          src={
                            String(
                              item.product.productImagePath?.[0]
                            ).startsWith('http')
                              ? item.product.productImagePath?.[0]
                              : `http://localhost:5000/${String(
                                  item.product.productImagePath?.[0]
                                ).replace(/\\/g, '/')}`
                          }
                          alt={item.product.productName || 'Sản phẩm không tên'}
                          className='w-16 h-16 object-cover rounded-md'
                        />
                        <div>
                          <h3 className='text-gray-900'>
                            {item.product.productName}
                          </h3>
                          <p className='text-gray-500'>
                            Quantity: {item.quantity}
                          </p>
                          <p>$ {item.itemPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* tong gia */}
                <div className=' border-t border-gray-200 '>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Total:</span>
                    <span className='text-gray-900'>$ {calculateTotal()}</span>
                  </div>
                </div>

                <div className='flex justify-between mt-6'>
                  <button
                    className='w-1/2 mr-2 font-semibold bg-gray-300 text-gray-700 py-3 rounded-md lg:text-lg text-sm hover:bg-gray-400'
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                  <button
                    className={`w-1/2 ml-2 font-semibold bg-purple-800 text-white py-3 rounded-md lg:text-lg text-sm flex justify-center items-center cursor-pointer ${
                      isLoading ? 'cursor-not-allowed' : 'hover:bg-purple-700'
                    }`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className='w-6 h-6 border-4 border-white border-dotted rounded-full animate-spin'></div>
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto'>
              <div className='flex justify-between mb-3 items-center'>
                <h3 className='text-xl font-semibold'>Select an address</h3>

                <button
                  className='bg-purple-800 p-2 rounded-lg font-bold text-white'
                  onClick={() => handleClickOpen()}
                >
                  New
                </button>

                <AddressFormDialog
                  open={open}
                  onClose={handleClose}
                  addressData={editAddress}
                />
              </div>

              <ul className='space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar'>
                {addresses.map((address, index) => (
                  <li
                    key={index}
                    className='p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100'
                    onClick={() => handleAddressSelect(index)}
                  >
                    <div className='font-bold'>{address.fullname}</div>
                    <div>{address.phone}</div>
                    <div>{`${address.detail}, ${address.commune}, ${address.district}, ${address.province}`}</div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsModalOpen(false)}
                className='mt-4 w-full p-3 bg-purple-800 hover:bg-hover-purple-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderPage;
