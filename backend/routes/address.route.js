import express from 'express';

import {
  createAddress,
  deleteAddress,
  getAddressById,
  getUserAddress,
  updateAddress,
  setAddressDefault,
  getProvinces,
  getDistricts,
  getWards,
} from '../controllers/address.controller.js';
import { auth } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/provinces', getProvinces);

router.get('/districts/:code', getDistricts);

router.get('/wards/:code', getWards);

router.get('/:id', getAddressById);

router.get('/', auth, getUserAddress);

router.post('/', auth, createAddress);

router.put('/:id', auth, updateAddress);

router.put('/set-default/:id', auth, setAddressDefault);

router.delete('/:id', auth, deleteAddress);

export default router;
