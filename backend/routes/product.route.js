import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import upload from '../configs/multerConfig.js';
import { auth, isAdmin } from '../middlewares/authentication.js';

const router = express.Router();

// Create a new product (with image upload)
router.post(
  '/',
  auth,
  isAdmin,
  upload.array('productImages', 5),
  createProduct
);

// Get all products (supports pagination and filters)
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID (with image upload)
router.put(
  '/:id',
  auth,
  isAdmin,
  upload.array('productImages', 5),
  updateProduct
);

// Delete a product by ID
router.delete('/:id', auth, isAdmin, deleteProduct);

export default router;
