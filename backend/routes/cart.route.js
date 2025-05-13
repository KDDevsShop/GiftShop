import express from 'express';
import {
  getCartByUser,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
  changeItemQuantity,
  getCartDetail,
} from '../controllers/cart.controller.js';
import { auth } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/', auth, getCartByUser);

router.post('/', auth, addToCart);

router.delete('/', auth, deleteAllFromCart);

router.delete('/:id', auth, deleteFromCart);

router.put('/quantity', auth, changeItemQuantity);

router.get('/:id', auth, getCartDetail);

export default router;
