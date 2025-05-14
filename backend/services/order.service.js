import { Order } from '../models/order.model.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';
import { NotFoundError, ValidationError } from '../utils/Error.js';

export const createOrderService = async (
  userId,
  orderDetail,
  shippingAddress
) => {
  if (!userId || !isValidObjectId(userId))
    throw new ValidationError('Invalid user id');
  if (!shippingAddress) throw new ValidationError('Missing required fields');
  if (!Array.isArray(orderDetail) || orderDetail.length === 0)
    throw new ValidationError('Cannot create order without products');

  const newOrder = new Order({ user: userId, orderDetail, shippingAddress });
  const savedOrder = await newOrder.save();

  return {
    status: 201,
    data: savedOrder,
    error: false,
  };
};

export const getAllOrdersService = async ({
  page = 1,
  limit = 10,
  orderStatus,
  startDate,
  endDate,
}) => {
  const query = {};

  if (orderStatus && isValidObjectId(orderStatus))
    query.orderStatus = orderStatus;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const orders = await Order.find(query)
    .populate('user', 'fullname email phone')
    .populate('shippingAddress', '-isDefault')
    .populate({
      path: 'orderDetail',
      populate: {
        path: 'product',
        select: 'productName productImagePath',
      },
    })
    .populate('orderStatus')
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const totalDocs = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalDocs / limitNumber);

  return {
    data: orders,
    meta: {
      totalDocs,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
    error: false,
  };
};

export const getOrderByUserService = async (
  userId,
  { page = 1, limit = 5, orderStatus, isLatest }
) => {
  if (!isValidObjectId(userId)) throw new ValidationError('Invalid user id');

  const query = { user: userId };

  if (orderStatus && isValidObjectId(orderStatus))
    query.orderStatus = orderStatus;

  const sortOptions =
    isLatest === 'latest' ? { createdAt: -1 } : { createdAt: 1 };

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const orders = await Order.find(query)
    .populate('user', 'fullname')
    .populate('shippingAddress', '-isDefault')
    .populate({
      path: 'orderDetail',
      populate: {
        path: 'product',
        select: 'productName productImagePath',
      },
    })
    .populate({
      path: 'orderStatus',
      select: 'orderStatus',
    })
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const totalDocs = await Order.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalDocs / limitNumber);

  return {
    data: orders,
    meta: {
      totalDocs,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
    error: false,
  };
};

export const updateOrderStatusService = async (orderId, orderStatus) => {
  if (!isValidObjectId(orderId)) throw new ValidationError('Invalid order id');
  if (!isValidObjectId(orderStatus))
    throw new ValidationError('Invalid order status id');

  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');

  order.orderStatus = orderStatus;
  await order.save();

  return {
    data: order,
    error: false,
  };
};

export const getOrderByIdService = async (orderId) => {
  if (!isValidObjectId(orderId)) throw new ValidationError('Invalid order id');

  const order = await Order.findById(orderId)
    .populate('user', 'fullname email phone')
    .populate('shippingAddress', '-isDefault')
    .populate({
      path: 'orderDetail',
      populate: {
        path: 'product',
        select: 'productName productImagePath',
      },
    })
    .populate({
      path: 'orderStatus',
      select: 'orderStatus',
    });

  if (!order) throw new NotFoundError('Order not found');

  return {
    data: order,
    error: false,
  };
};

export const getLastOrdersService = async (limit) => {
  const orders = await Order.find({})
    .sort({ orderDate: -1 })
    .limit(parseInt(limit, 10))
    .populate('user', 'fullname email')
    .populate('shippingAddress', '-isDefault')
    .populate({
      path: 'orderDetail',
      populate: {
        path: 'product',
        select: 'productName productImagePath',
      },
    })
    .populate({
      path: 'orderStatus',
      select: 'orderStatus',
    });

  if (orders.length === 0) throw new NotFoundError('No orders found');

  return {
    data: orders,
    error: false,
  };
};
