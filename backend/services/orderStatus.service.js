import { OrderStatus, Order } from '../models/order.model.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/Error.js';

import { isValidObjectId } from '../utils/isValidObjectId.js';

export const getAllOrderStatus = async () => {
  const orderStatus = await OrderStatus.find();
  if (!Array.isArray(orderStatus) || orderStatus.length === 0) {
    throw new NotFoundError('Not found order status');
  }
  return orderStatus;
};

export const getOrderStatusById = async (id) => {
  if (!id || !isValidObjectId(id)) {
    throw new ValidationError('Invalid object id');
  }

  const orderStatus = await OrderStatus.findById(id);
  if (!orderStatus) {
    throw new NotFoundError('Not found order status with this id');
  }

  return orderStatus;
};

export const createOrderStatus = async (orderStatus) => {
  if (!orderStatus) {
    throw new ValidationError('Missing required field');
  }

  const existingOrderStatus = await OrderStatus.findOne({ orderStatus });
  if (existingOrderStatus) {
    throw new ConflictError('This order status already exists');
  }

  return await OrderStatus.create({ orderStatus });
};

export const updateOrderStatus = async (id, orderStatus) => {
  if (!id || !isValidObjectId(id)) {
    throw new ValidationError('Invalid object id');
  }

  if (!orderStatus) {
    throw new ValidationError('Order status cannot be empty');
  }

  const updatedOrderStatus = await OrderStatus.findByIdAndUpdate(
    id,
    { orderStatus },
    { new: true, runValidators: true }
  );

  if (!updatedOrderStatus) {
    throw new NotFoundError('Cannot find this order status to update');
  }

  return updatedOrderStatus;
};

export const deleteOrderStatus = async (id) => {
  if (!id || !isValidObjectId(id)) {
    throw new ValidationError('Invalid object id');
  }

  const deletedOrderStatus = await OrderStatus.findByIdAndDelete(id);
  if (!deletedOrderStatus) {
    throw new NotFoundError('Cannot find this order status to delete');
  }
};

export const getPendingOrdersOverdue = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const pendingStatus = await OrderStatus.findOne({ orderStatus: 'Chờ xử lý' });
  if (!pendingStatus) {
    throw new NotFoundError('Trạng thái "Chờ xử lý" không tồn tại');
  }

  return await Order.find({
    orderStatus: pendingStatus._id,
    orderDate: { $lte: sevenDaysAgo },
  }).populate([
    { path: 'user', select: 'fullname email phone' },
    { path: 'shippingAddress', select: '-isDefault' },
    'shippingMethod',
    'paymentMethod',
    { path: 'voucher', select: 'discountPercent maxPriceDiscount expiredDate' },
    {
      path: 'orderDetail',
      populate: {
        path: 'product',
        select: 'productName productImagePath',
        populate: { path: 'discount', select: 'discountPercent' },
      },
    },
    'orderStatus',
  ]);
};

export const cancelPendingOrdersOverdue = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const pendingStatus = await OrderStatus.findOne({ orderStatus: 'Chờ xử lý' });
  const cancelledStatus = await OrderStatus.findOne({ orderStatus: 'Đã hủy' });

  if (!pendingStatus || !cancelledStatus) {
    throw new ValidationError(
      'Trạng thái "Chờ xử lý" hoặc "Đã hủy" không tồn tại trong hệ thống.'
    );
  }

  const result = await Order.updateMany(
    {
      orderStatus: pendingStatus._id,
      orderDate: { $lte: sevenDaysAgo },
    },
    { orderStatus: cancelledStatus._id, updatedAt: new Date() }
  );

  const updatedOrders = await Order.find({
    orderStatus: cancelledStatus._id,
  }).populate('user', 'fullname email phone');

  return updatedOrders;
};
