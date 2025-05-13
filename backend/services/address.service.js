import { Address, User } from '../models/user.model.js';
import { NotFoundError, ValidationError } from '../utils/Error.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';

class AddressService {
  async getUserAddress(userId) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }

    const user = await User.findById(userId).populate('address');
    if (!user) {
      throw new Error('User not found');
    }

    const addresses = user.address;
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new NotFoundError('No address found for this user');
    }

    return addresses;
  }

  async getAddressById(addressId) {
    if (!addressId || !isValidObjectId(addressId)) {
      throw new ValidationError('Invalid Id');
    }

    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }

  async createAddress(userId, addressData) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id format');
    }

    const user = await User.findById(userId).populate('address');

    if (!user) {
      throw new Error('User does not exist');
    }

    if (addressData.isDefault) {
      await Address.updateMany(
        { _id: { $in: user.address }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const duplicateAddress = await Address.findOne({
      fullname: addressData.fullname,
      phone: addressData.phone,
      province: addressData.province,
      district: addressData.district,
      commune: addressData.commune,
      detail: addressData.detail,
    });

    if (duplicateAddress) {
      throw new Error('Address already exists');
    }

    const newAddress = await Address.create(addressData);
    user.address.push(newAddress._id);
    await user.save();

    return newAddress;
  }

  async updateAddress(addressId, userId, addressData) {
    if (!addressId || !isValidObjectId(addressId)) {
      throw new Error('Invalid Id');
    }

    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    if (addressData.isDefault) {
      const user = await User.findById(userId).populate('address');
      await Address.updateMany(
        { _id: { $in: user.address }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        fullname: addressData.fullname || address.fullname,
        phone: addressData.phone || address.phone,
        province: addressData.province || address.province,
        district: addressData.district || address.district,
        commune: addressData.commune || address.commune,
        detail: addressData.detail || address.detail,
        isDefault:
          addressData.isDefault !== undefined
            ? addressData.isDefault
            : address.isDefault,
      },
      { new: true, runValidators: true }
    );

    return updatedAddress;
  }

  async deleteAddress(addressId, userId) {
    if (!addressId || !isValidObjectId(addressId)) {
      throw new Error('Invalid Id');
    }

    await Address.findByIdAndDelete(addressId);
    await User.updateOne({ _id: userId }, { $pull: { address: addressId } });

    return addressId;
  }

  async setAddressDefault(addressId, userId) {
    if (!addressId || !isValidObjectId(addressId)) {
      throw new Error('Invalid Id');
    }

    const user = await User.findById(userId).populate('address');
    if (!user) {
      throw new Error('User not found');
    }

    await Address.updateMany(
      { _id: { $in: user.address }, isDefault: true },
      { $set: { isDefault: false } }
    );

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    return updatedAddress;
  }

  async getProvinces() {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      if (!response.ok) {
        throw new Error(`Error fetching provinces: ${response.statusText}`);
      }
      const provinces = await response.json();
      return provinces;
    } catch (error) {
      throw new Error(
        error.message || 'Error fetching provinces from Open API'
      );
    }
  }

  async getDistricts(provinceCode) {
    try {
      console.log(provinceCode);
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detailed Error:', errorData);
        throw new Error(`Error fetching districts: ${response.statusText}`);
      }
      const data = await response.json();
      return data.districts;
    } catch (error) {
      throw new Error(
        error.message || 'Error fetching districts from Open API'
      );
    }
  }

  async getWards(districtCode) {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      if (!response.ok) {
        throw new Error(`Error fetching wards: ${response.statusText}`);
      }
      const data = await response.json();
      return data.wards;
    } catch (error) {
      throw new Error(error.message || 'Error fetching wards from Open API');
    }
  }
}

export default new AddressService();
