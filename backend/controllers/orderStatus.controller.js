import * as orderStatusService from '../services/orderStatus.service.js';
import logError from '../utils/logError.js';

export const getAllOrderStatus = async (req, res) => {
  try {
    const orderStatus = await orderStatusService.getAllOrderStatus();
    res.status(200).json({ data: orderStatus, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getOrderStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderStatus = await orderStatusService.getOrderStatusById(id);
    res.status(200).json({ data: orderStatus, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const createOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    console.log(req.body);
    const createdOrderStatus = await orderStatusService.createOrderStatus(
      orderStatus
    );
    res.status(201).json({ data: createdOrderStatus, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const updatedOrderStatus = await orderStatusService.updateOrderStatus(
      id,
      orderStatus
    );
    res.status(200).json({ data: updatedOrderStatus, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const deleteOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await orderStatusService.deleteOrderStatus(id);
    res.status(200).json({ error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getPendingOrdersOverdue = async (req, res) => {
  try {
    const overdueOrders = await orderStatusService.getPendingOrdersOverdue();
    res.status(200).json({
      message: `Có ${overdueOrders.length} đơn hàng chờ xử lý quá hạn.`,
      overdueOrders,
    });
  } catch (error) {
    logError(error, res);
  }
};

export const cancelPendingOrdersOverdue = async (req, res) => {
  try {
    const updatedOrders = await orderStatusService.cancelPendingOrdersOverdue();
    res.status(200).json({
      message: `Cập nhật thành công ${updatedOrders.length} đơn hàng chờ xử lý quá hạn thành hủy đơn.`,
      updatedOrders,
    });
  } catch (error) {
    logError(error, res);
  }
};
