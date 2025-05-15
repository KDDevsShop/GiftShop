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

router.post('/add', auth, addToCart);

router.delete('/', auth, deleteAllFromCart);

router.delete('/:id', auth, deleteFromCart);

router.put('/update-quantity', auth, changeItemQuantity);

router.get('/cart-detail/:id', auth, getCartDetail);

export default router;
