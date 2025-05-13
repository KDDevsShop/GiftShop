import addressService from '../services/address.service.js';
import logError from '../utils/logError.js';

export const getUserAddress = async (req, res) => {
  try {
    const { userId } = req.userId;
    const addresses = await addressService.getUserAddress(userId);
    res.status(200).json({ data: addresses, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const address = await addressService.getAddressById(addressId);
    res.status(200).json({ data: address, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const createAddress = async (req, res) => {
  try {
    const { userId } = req.userId;
    const addressData = req.body;
    const newAddress = await addressService.createAddress(userId, addressData);
    res.status(201).json({ data: newAddress, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { userId } = req.userId;
    const addressData = req.body;
    const updatedAddress = await addressService.updateAddress(
      addressId,
      userId,
      addressData
    );
    res.status(200).json({ data: updatedAddress, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { userId } = req.userId;
    const deletedId = await addressService.deleteAddress(addressId, userId);
    res.status(200).json({
      data: { _id: deletedId },
      message: 'Delete address successfully',
    });
  } catch (error) {
    logError(error, res);
  }
};

export const setAddressDefault = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { userId } = req.userId;
    const updatedAddress = await addressService.setAddressDefault(
      addressId,
      userId
    );
    res.status(200).json({
      data: updatedAddress,
      message: 'Address set as default successfully',
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getProvinces = async (req, res) => {
  try {
    const provinces = await addressService.getProvinces();
    res.status(200).json({ data: provinces, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getDistricts = async (req, res) => {
  try {
    const { code } = req.params;
    console.log(req.params);
    const districts = await addressService.getDistricts(code);
    res.status(200).json({ data: districts, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getWards = async (req, res) => {
  try {
    const { code } = req.params;
    const wards = await addressService.getWards(code);
    res.status(200).json({ data: wards, error: false });
  } catch (error) {
    logError(error, res);
  }
};
