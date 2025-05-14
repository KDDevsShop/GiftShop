import express from 'express';
import {
  getAllOrderStatus,
  getOrderStatusById,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from '../controllers/orderStatus.controller.js';
import { auth, isAdmin } from '../middlewares/authentication.js';

const router = express.Router();

// Public Routes
router.get('/', getAllOrderStatus);
router.get('/:id', getOrderStatusById);

// Protected Routes
router.post('/', auth, isAdmin, createOrderStatus);
router.put('/:id', auth, isAdmin, updateOrderStatus);
router.delete('/:id', auth, isAdmin, deleteOrderStatus);

export default router;
