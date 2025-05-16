import logError from '../utils/logError.js';
import {
  createOrderService,
  getAllOrdersService,
  getOrderByUserService,
  updateOrderStatusService,
  getOrderByIdService,
  getLastOrdersService,
} from '../services/order.service.js';

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.userId;
    const {
      orderDetail,
      totalPrice,
      shippingAddress,
      deliveryMethod = 'Standard',
      paymentMethod = 'COD',
    } = req.body;

    const createdOrder = await createOrderService(
      userId,
      orderDetail,
      totalPrice,
      shippingAddress,
      deliveryMethod,
      paymentMethod
    );
    res.status(createdOrder.status).json(createdOrder);
  } catch (error) {
    logError(error, res);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService(req.query);
    res.status(200).json(orders);
  } catch (error) {
    logError(error, res);
  }
};

export const getOrderByUser = async (req, res) => {
  try {
    const { userId } = req.userId;
    console.log(req.query);
    const orders = await getOrderByUserService(userId, req.query);
    res.status(200).json(orders);
  } catch (error) {
    logError(error, res);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { orderStatus } = req.body;
    const updatedOrder = await updateOrderStatusService(orderId, orderStatus);
    res.status(200).json(updatedOrder);
  } catch (error) {
    logError(error, res);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const order = await getOrderByIdService(orderId);
    res.status(200).json(order);
  } catch (error) {
    logError(error, res);
  }
};

export const getLastOrders = async (req, res) => {
  try {
    const limit = req.query.limit || 3;
    const latestOrders = await getLastOrdersService(limit);
    res.status(200).json(latestOrders);
  } catch (error) {
    logError(error, res);
  }
};
