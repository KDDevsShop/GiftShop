import express from 'express';
import { auth } from '../middlewares/authentication.js';
import {
  createOrder,
  getAllOrders,
  getOrderByUser,
  updateOrderStatus,
  getOrderById,
  getLastOrders,
} from '../controllers/order.controller.js';

const router = express.Router();

// 🔄 Order Routes
router.post('/', auth, createOrder);
router.get('/', getAllOrders);
router.get('/user', auth, getOrderByUser);
router.get('/latest', auth, getLastOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus);

export default router;
