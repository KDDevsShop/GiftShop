import cartService from '../services/cart.service.js';
import logError from '../utils/logError.js';

export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.userId;
    const cartData = await cartService.getCartByUser(userId);
    res.status(200).json({ data: cartData, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.userId;
    const { productId, quantity } = req.body;
    const cartData = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json({ data: cartData, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { userId } = req.userId;
    const { id: productId } = req.params;
    const cartData = await cartService.deleteFromCart(userId, productId);
    res.status(200).json({ data: cartData, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const deleteAllFromCart = async (req, res) => {
  try {
    const { userId } = req.userId;
    const result = await cartService.deleteAllFromCart(userId);
    res.status(200).json({ message: result.message, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const changeItemQuantity = async (req, res) => {
  try {
    const { userId } = req.userId;
    const { productId, quantity } = req.body;
    const cartData = await cartService.changeItemQuantity(
      userId,
      productId,
      quantity
    );
    res.status(200).json({ data: cartData, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getCartDetail = async (req, res) => {
  try {
    const { id: cartDetailId } = req.params;
    const cartDetail = await cartService.getCartDetail(cartDetailId);
    res.status(200).json({ data: cartDetail, error: false });
  } catch (error) {
    logError(error, res);
  }
};
