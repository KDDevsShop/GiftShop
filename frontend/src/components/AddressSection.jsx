import { useEffect, useState } from 'react';
import { Trash2, SquarePen } from 'lucide-react';
import addressService from '../services/address.service';
import { useCallback } from 'react';
import AddressFormDialog from './AddressFormDialog';

// import AddressFormDialog from '@components/ProfilePage/AddressFormDialog';

function AddressSection() {
  //   const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  const [loading, setLoading] = useState(false);

  const getUsersAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await addressService.getUserAddress(accessToken);
      setAddresses(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const handleClose = () => {
    setOpen(false);
    getUsersAddresses();
  };

  const handleClickOpen = (index = null) => {
    if (index !== null) {
      setEditAddress(addresses[index]);
    } else setEditAddress({});
    setOpen(true);
  };

  const handleSetDefault = (index) => {
    const accessToken = localStorage.getItem('accessToken');
    addressService.setDefaultAddress(addresses[index]._id, accessToken);
    getUsersAddresses();
  };

  const handleDelete = (index) => {
    const accessToken = localStorage.getItem('accessToken');
    addressService.deleteAddress(addresses[index]._id, accessToken);
    getUsersAddresses();
  };

  useEffect(() => {
    getUsersAddresses();
  }, [getUsersAddresses]);

  return (
    <div className=''>
      <button
        className='bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
        onClick={() => handleClickOpen()}
      >
        + New address
      </button>

      <AddressFormDialog
        open={open}
        onClose={handleClose}
        addressData={editAddress}
      />

      <div className='mt-6'>
        <h2 className='text-xl font-semibold mb-4'>Your address list</h2>
        {loading ? (
          <p>Loading...</p>
        ) : addresses.length > 0 ? (
          <div className='overflow-y-auto lg:max-h-96 max-h-full no-scrollbar'>
            {addresses.map((address, index) => (
              <div key={index} className='border-t border-gray-300 py-5'>
                <div className='flex justify-between'>
                  <div>
                    <div className='flex items-center'>
                      <h3 className='text-lg font-semibold'>
                        {address.fullname}
                      </h3>
                      <div className='border-r-2 border-gray-300 h-6 mx-4' />
                      <p className='text-gray-600'>{address.phone}</p>
                    </div>
                    <p>{address.detail}</p>
                    <p>
                      {address.commune}, {address.district}, {address.province}
                    </p>
                    {address.isDefault && (
                      <span className='text-red-500 font-bold '>Mặc định</span>
                    )}
                  </div>
                  <div className='text-right items-center'>
                    <button
                      className='text-blue-500 hover:underline'
                      onClick={() => handleClickOpen(index)}
                    >
                      <SquarePen />
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          className='ml-4 text-red-500 hover:underline'
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 />
                        </button>
                        <button
                          className='block mt-2 text-gray-600 border border-gray-300 py-1 px-2 rounded'
                          onClick={() => handleSetDefault(index)}
                        >
                          Set as default
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You don't have any address here.</p>
        )}
      </div>
    </div>
  );
}

export default AddressSection;
