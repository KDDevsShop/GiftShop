import express from 'express';
import {
  createProductType,
  getAllProductTypes,
  getProductTypeById,
  updateProductType,
  deleteProductType,
} from '../controllers/productType.controller.js';
import { auth, isAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.post('/', auth, isAdmin, createProductType);

router.get('/', getAllProductTypes);

router.get('/:id', getProductTypeById);

router.put('/:id', auth, isAdmin, updateProductType);

router.delete('/:id', auth, isAdmin, deleteProductType);

export default router;
