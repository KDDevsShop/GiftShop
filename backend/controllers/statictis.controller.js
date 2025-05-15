import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { ProductType } from '../models/product.model.js';
import logError from '../utils/logError.js';
import { OrderStatus } from '../models/order.model.js';

import mongoose from 'mongoose';
import { isValidObjectId } from '../utils/isValidObjectId.js';

export const getRevenueForAllYears = async (req, res) => {
  try {
    // Get all distinct years from orderDate
    const years = await Order.aggregate([
      {
        $group: {
          _id: { $year: '$orderDate' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).then((results) => results.map((item) => item._id));

    // Get completed and cancelled order statuses
    const completedStatus = await OrderStatus.findOne({
      orderStatus: 'Completed',
    });
    const cancelledStatus = await OrderStatus.findOne({
      orderStatus: 'Cancelled',
    });

    if (!completedStatus || !cancelledStatus) {
      return res.status(404).json({
        message: 'Required order statuses not found in the database',
        error: true,
      });
    }

    const data = [];

    // Calculate revenue for each year
    for (const year of years) {
      const revenueData = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31T23:59:59`),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            paidRevenue: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$orderStatus', completedStatus._id],
                  },
                  '$totalPrice',
                  0,
                ],
              },
            },
            unpaidRevenue: {
              $sum: {
                $cond: [
                  {
                    $ne: ['$orderStatus', cancelledStatus._id],
                  },
                  '$totalPrice',
                  0,
                ],
              },
            },
          },
        },
      ]);

      const totalRevenue = revenueData[0]?.totalRevenue || 0;
      const paidRevenue = revenueData[0]?.paidRevenue || 0;
      const unpaidRevenue = revenueData[0]?.unpaidRevenue || 0;

      data.push({
        year,
        totalRevenue,
        paidRevenue,
        unpaidRevenue,
      });
    }

    res.status(200).json({
      message: 'Thống kê doanh thu tổng thể theo năm thành công.',
      data,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê doanh thu:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};

export const getTotalOrdersPerMonthByYear = async (req, res) => {
  try {
    // Get all unique years from the orderDate field
    const years = await Order.aggregate([
      {
        $group: {
          _id: { $year: '$orderDate' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).then((results) => results.map((item) => item._id));

    // Get all order statuses
    const orderStatuses = await OrderStatus.find().sort({ orderStatus: 1 });

    if (!orderStatuses || orderStatuses.length === 0) {
      return res.status(404).json({
        message: 'No order statuses found in the database',
        error: true,
      });
    }

    const results = [];

    // Calculate total orders per month for each year and status
    for (const year of years) {
      const yearStats = { year };

      // For each status, get monthly order counts
      for (const status of orderStatuses) {
        const totalOrders = await Order.aggregate([
          {
            $match: {
              orderStatus: status._id,
              orderDate: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31T23:59:59`),
              },
            },
          },
          {
            $group: {
              _id: { $month: '$orderDate' },
              totalOrders: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);

        // Format the result as a month-wise breakdown
        yearStats[status.orderStatus] = Array(12).fill(0);
        totalOrders.forEach((monthData) => {
          yearStats[status.orderStatus][monthData._id - 1] =
            monthData.totalOrders;
        });
      }

      // Add total orders across all statuses for each month
      const totalOrdersByMonth = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31T23:59:59`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$orderDate' },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      yearStats['Total'] = Array(12).fill(0);
      totalOrdersByMonth.forEach((monthData) => {
        yearStats['Total'][monthData._id - 1] = monthData.totalOrders;
      });

      results.push(yearStats);
    }

    res.status(200).json({
      message: 'Tổng số đơn hàng theo trạng thái trong từng năm',
      statistics: results,
    });
  } catch (error) {
    console.error('Error fetching total orders per month by year:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
  }
};

export const getStatisticsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Generate the full date range
    const daysArray = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      daysArray.push(new Date(d).toISOString().split('T')[0]);
    }

    // Fetch all order statuses for a consistent structure
    const orderStatuses = await OrderStatus.find();

    // Fetch all product types for consistent output
    const productTypesList = await ProductType.find().select('productTypeName');

    // Fetch revenue and order status data
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          totalPrice: 1,
          orderStatus: 1,
          orderDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
          },
        },
      },
      {
        $group: {
          _id: '$orderDate',
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          orderStatuses: { $push: '$orderStatus' },
        },
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'orderStatuses',
          foreignField: '_id',
          as: 'statusInfo',
        },
      },
      {
        $addFields: {
          statusSummary: {
            $map: {
              input: '$statusInfo',
              as: 'status',
              in: {
                orderStatus: '$$status.orderStatus',
                count: {
                  $size: {
                    $filter: {
                      input: '$orderStatuses',
                      as: 'statusId',
                      cond: { $eq: ['$$statusId', '$$status._id'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // Fetch product sales data - Updated to match your model structure
    const productTypeData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $unwind: '$orderDetail',
      },
      {
        $lookup: {
          from: 'cartdetails',
          localField: 'orderDetail',
          foreignField: '_id',
          as: 'cartDetail',
        },
      },
      {
        $unwind: '$cartDetail',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartDetail.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $lookup: {
          from: 'producttypes',
          localField: 'product.productType', // Direct reference to productType in Product model
          foreignField: '_id',
          as: 'productType',
        },
      },
      {
        $unwind: '$productType',
      },
      {
        $group: {
          _id: {
            orderDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
            },
            productTypeName: '$productType.productTypeName',
          },
          totalSold: { $sum: '$cartDetail.quantity' },
        },
      },
    ]);

    // Build the final response
    const fullData = daysArray.map((day) => {
      // Revenue and order status data for the day
      const revenueForDay = revenueData.find((data) => data._id === day) || {
        totalRevenue: 0,
        totalOrders: 0,
        statusSummary: [],
      };

      // Prepare order status summary
      const orderStatusSummary = orderStatuses.map((status) => {
        const matchingStatus = revenueForDay.statusSummary?.find(
          (item) => item.orderStatus === status.orderStatus
        );
        return {
          orderStatus: status.orderStatus,
          totalOrders: matchingStatus ? matchingStatus.count : 0,
        };
      });

      // Product type data for the day
      const productTypesForDay = productTypeData.filter(
        (data) => data._id.orderDate === day
      );

      const productTypeStats = productTypesList.map((productType) => {
        const match = productTypesForDay.find(
          (item) => item._id.productTypeName === productType.productTypeName
        );
        return {
          productType: productType.productTypeName,
          totalSold: match ? match.totalSold : 0,
        };
      });

      const totalProductsSold = productTypesForDay.reduce(
        (acc, item) => acc + item.totalSold,
        0
      );

      return {
        time: day,
        totalRevenue: revenueForDay.totalRevenue || 0,
        totalOrders: revenueForDay.totalOrders || 0,
        orderStatusSummary,
        totalProductsSold,
        productTypeStatistics: productTypeStats,
      };
    });

    // Send the response
    res.status(200).json({
      message: 'Thống kê theo khoảng ngày thành công',
      data: fullData,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    res.status(500).json({
      message: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      error: error.message,
    });
  }
};

export const getStatisticsByYear = async (req, res) => {
  try {
    console.log('running this');
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: 'Vui lòng cung cấp năm.' });
    }

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999`);

    // Generate an array for all months in the year
    const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1);

    // Fetch all order statuses
    const orderStatuses = await OrderStatus.find();

    // Fetch all product types
    const productTypesList = await ProductType.find().select('productTypeName');

    // 1. Aggregate revenue and order count by month
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          totalPrice: 1,
          orderStatus: 1,
          month: { $month: '$orderDate' },
        },
      },
      {
        $group: {
          _id: '$month',
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          orderStatuses: { $push: '$orderStatus' },
        },
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'orderStatuses',
          foreignField: '_id',
          as: 'statusInfo',
        },
      },
      {
        $addFields: {
          statusSummary: {
            $map: {
              input: '$statusInfo',
              as: 'status',
              in: {
                orderStatus: '$$status.orderStatus',
                count: {
                  $size: {
                    $filter: {
                      input: '$orderStatuses',
                      as: 'statusId',
                      cond: { $eq: ['$$statusId', '$$status._id'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month number
      },
    ]);

    // 2. Aggregate product sales by month and product type
    const productTypeData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $unwind: '$orderDetail',
      },
      {
        $lookup: {
          from: 'cartdetails',
          localField: 'orderDetail',
          foreignField: '_id',
          as: 'cartDetail',
        },
      },
      {
        $unwind: '$cartDetail',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartDetail.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $lookup: {
          from: 'producttypes',
          localField: 'product.productType',
          foreignField: '_id',
          as: 'productType',
        },
      },
      {
        $unwind: {
          path: '$productType',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$orderDate' },
            productTypeName: '$productType.productTypeName',
          },
          totalSold: { $sum: '$cartDetail.quantity' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          productTypes: {
            $push: {
              productType: '$_id.productTypeName',
              totalSold: '$totalSold',
            },
          },
          totalProductsSold: { $sum: '$totalSold' },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month number
      },
    ]);

    // 3. Build the final response - one entry per month
    const fullData = monthsArray.map((month) => {
      // Revenue and status data for the month
      const revenueForMonth = revenueData.find(
        (data) => data._id === month
      ) || {
        totalRevenue: 0,
        totalOrders: 0,
        statusSummary: [],
      };

      // Prepare order status summary
      const orderStatusSummary = orderStatuses.map((status) => {
        const matchingStatus = revenueForMonth.statusSummary?.find(
          (item) => item.orderStatus === status.orderStatus
        );
        return {
          orderStatus: status.orderStatus,
          totalOrders: matchingStatus ? matchingStatus.count : 0,
        };
      });

      // Product type data for the month
      const productTypesForMonth = productTypeData.find(
        (data) => data._id === month
      ) || {
        productTypes: [],
        totalProductsSold: 0,
      };

      // Ensure all product types are included
      const productTypeStats = productTypesList.map((productType) => {
        const match = productTypesForMonth.productTypes?.find(
          (item) => item.productType === productType.productTypeName
        );
        return {
          productType: productType.productTypeName,
          totalSold: match ? match.totalSold : 0,
        };
      });

      return {
        month: month, // Just return the month number
        monthLabel: `Tháng ${month}`, // Add a formatted label
        totalRevenue: revenueForMonth.totalRevenue || 0,
        totalOrders: revenueForMonth.totalOrders || 0,
        orderStatusSummary,
        totalProductsSold: productTypesForMonth.totalProductsSold || 0,
        productTypeStatistics: productTypeStats,
      };
    });

    // Calculate total statistics for the year
    const totalRevenue = fullData.reduce(
      (sum, data) => sum + data.totalRevenue,
      0
    );
    const totalOrders = fullData.reduce(
      (sum, data) => sum + data.totalOrders,
      0
    );
    const totalProductsSold = fullData.reduce(
      (sum, data) => sum + data.totalProductsSold,
      0
    );

    // Send the response
    res.status(200).json({
      message: 'Thống kê theo năm thành công',
      data: fullData,
      year,
      totalRevenue,
      totalOrders,
      totalProductsSold,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê theo năm:', error);
    res.status(500).json({
      message: 'Có lỗi xảy ra, vui lòng thử lại sau.',
      error: error.message,
    });
  }
};

export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});

    res.status(200).json({
      message: 'Số lượng tài khoản người dùng hiện có.',
      totalUsers,
      error: false,
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getTotalUsersByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Kiểm tra nếu có khoảng thời gian bắt đầu và kết thúc
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc.',
        error: true,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Đặt giờ cuối cùng trong ngày kết thúc

    // Tạo một mảng chứa tất cả các ngày trong khoảng thời gian
    const daysArray = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      daysArray.push(d.toISOString().split('T')[0]);
    }

    // Sử dụng MongoDB aggregation để nhóm dữ liệu theo ngày đăng ký
    const totalUsersByDate = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc theo khoảng thời gian
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // Nhóm theo ngày
          },
          totalUsers: { $sum: 1 }, // Tính tổng số người dùng trong mỗi ngày
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày tăng dần
    ]);

    // Tạo đối tượng để lưu trữ số người dùng theo ngày
    const userCountByDate = totalUsersByDate.reduce((acc, dayData) => {
      acc[dayData._id] = dayData.totalUsers;
      return acc;
    }, {});

    // Tính tổng số người dùng cho đến ngày kết thúc
    const totalUsersUntilEndDate = await User.countDocuments({
      createdAt: { $lte: end },
    });

    // Tạo mảng kết quả để trả về
    const result = daysArray.map((day) => ({
      time: day,
      totalUsers: userCountByDate[day] || 0, // Gán 0 nếu không có người dùng đăng ký trong ngày
    }));

    return res.status(200).json({
      message: 'Số lượng tài khoản người dùng đăng ký theo thời gian.',
      totalUsersByDate: result,
      totalUsersUntilEndDate,
      error: false,
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getTotalUsersByYear = async (req, res) => {
  try {
    const { year } = req.query;

    // Kiểm tra nếu có năm
    if (!year) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp năm.',
        error: true,
      });
    }

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);
    end.setHours(23, 59, 59, 999); // Đặt giờ cuối cùng trong năm

    // Sử dụng MongoDB aggregation để nhóm dữ liệu theo tháng đăng ký
    const totalUsersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc theo năm
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }, // Nhóm theo tháng
          },
          totalUsers: { $sum: 1 }, // Tính tổng số người dùng trong mỗi tháng
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo tháng tăng dần
    ]);

    // Tạo mảng chứa số người dùng theo từng tháng
    const userCountByMonth = totalUsersByMonth.reduce((acc, monthData) => {
      acc[monthData._id.split('-')[1]] = monthData.totalUsers; // Lưu số lượng người dùng theo tháng
      return acc;
    }, {});

    // Tạo mảng kết quả cho từng tháng trong năm
    const result = Array.from({ length: 12 }, (_, index) => {
      const month = String(index + 1).padStart(2, '0'); // Chuyển đổi sang định dạng MM
      return {
        month: `Tháng ${month}`,
        totalUsers: userCountByMonth[month] || 0,
      };
    });

    // Tính tổng số người dùng cho đến cuối năm
    const totalUsersUntilYearEnd = await User.countDocuments({
      createdAt: { $lte: end },
    });

    // Tạo kết quả trả về
    return res.status(200).json({
      message: 'Số lượng tài khoản người dùng đăng ký theo tháng trong năm.',
      year: year,
      totalUsersByMonth: result, // Mảng chứa thông tin từng tháng
      totalUsersUntilYearEnd,
      error: false,
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getProductTypeSalesPerYears = async (req, res) => {
  try {
    // Nhận tất cả các năm trong dữ liệu
    const years = await Order.aggregate([
      {
        $addFields: {
          year: { $year: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$year',
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
        },
      },
    ]);

    // Nếu không có năm nào được tìm thấy
    if (!years || years.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu năm nào.' });
    }

    // Thống kê doanh số cho mỗi năm
    const result = await Order.aggregate([
      {
        $unwind: '$orderDetail',
      },
      {
        $lookup: {
          from: 'cartdetails',
          localField: 'orderDetail',
          foreignField: '_id',
          as: 'cartDetail',
        },
      },
      {
        $unwind: '$cartDetail',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartDetail.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $lookup: {
          from: 'producttypes',
          localField: 'product.productType',
          foreignField: '_id',
          as: 'productType',
        },
      },
      {
        $unwind: '$productType',
      },
      {
        $addFields: {
          year: { $year: '$createdAt' },
        },
      },
      {
        // Nhóm dữ liệu theo năm và loại sản phẩm
        $group: {
          _id: {
            year: '$year',
            productType: '$productType.productTypeName',
          },
          totalSold: { $sum: '$cartDetail.quantity' },
        },
      },
      {
        // Nhóm lại theo năm
        $group: {
          _id: '$_id.year',
          productTypes: {
            $push: {
              productType: '$_id.productType',
              totalSold: '$totalSold',
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          productTypes: 1,
        },
      },
    ]);

    // Nếu không có dữ liệu thống kê nào
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không có dữ liệu bán hàng nào.' });
    }

    res.status(200).json({
      data: result,
      error: false,
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getTotalSoldPerMonth = async (req, res) => {
  try {
    // Lấy tháng và năm từ query (nếu không có thì dùng tháng hiện tại)
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Tính toán thời gian bắt đầu và kết thúc của tháng
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Kiểm tra đơn hàng trong tháng đã chọn
    const ordersInMonth = await Order.find({
      orderDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (ordersInMonth.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không có đơn hàng nào trong tháng này.' });
    }

    const result = await Order.aggregate([
      {
        // Lọc các đơn hàng trong tháng được chọn
        $match: {
          orderDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        // Tách từng orderDetail thành các document riêng
        $unwind: '$orderDetail',
      },
      {
        // Lookup để lấy thông tin sản phẩm từ CartDetail -> Product
        $lookup: {
          from: 'cartdetails',
          localField: 'orderDetail', // field để join từ Order
          foreignField: '_id', // field từ CartDetail
          as: 'cartDetail',
        },
      },
      {
        $unwind: '$cartDetail', // Mở rộng cartDetail (mảng) thành các document riêng
      },
      {
        // Lookup để lấy thông tin sản phẩm từ Product
        $lookup: {
          from: 'products', // Tên collection của Product
          localField: 'cartDetail.product', // product field từ CartDetail
          foreignField: '_id', // _id từ Product
          as: 'product',
        },
      },
      {
        $unwind: '$product', // Mở rộng product thành document riêng
      },
      {
        // Nhóm theo từng sản phẩm và tính tổng số lượng đã bán
        $group: {
          _id: '$product._id', // Nhóm theo ID sản phẩm
          productName: { $first: '$product.productName' }, // Lấy tên sản phẩm
          price: { $first: '$product.price' }, // Lấy giá sản phẩm
          productImagePath: {
            $first: { $arrayElemAt: ['$product.productImagePath', 0] },
          }, // Lấy ảnh đầu tiên
          totalSold: { $sum: '$cartDetail.quantity' }, // Tính tổng số lượng sản phẩm đã bán
        },
      },
      {
        // Sắp xếp theo tổng số lượng bán từ cao đến thấp
        $sort: { totalSold: -1 },
      },
      {
        // Giới hạn chỉ lấy 10 sản phẩm bán nhiều nhất
        $limit: 10,
      },
      {
        // Tính tổng tất cả sản phẩm đã bán ra trong tháng
        $group: {
          _id: null,
          topProducts: {
            $push: {
              productId: '$_id',
              productName: '$productName',
              price: '$price',
              productImagePath: '$productImagePath',
              totalSold: '$totalSold',
            }, // Lưu trữ thông tin sản phẩm và số lượng bán
          },
          totalProductsSold: { $sum: '$totalSold' }, // Tính tổng tất cả sản phẩm đã bán
        },
      },
      {
        // Project để định dạng kết quả cuối cùng
        $project: {
          _id: 0, // Ẩn _id
          topProducts: 1, // Sản phẩm bán nhiều nhất và số lượng bán ra
          totalProductsSold: 1, // Tổng số sản phẩm đã bán trong tháng
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không có dữ liệu cho tháng này.' });
    }

    // Trả về danh sách top 10 sản phẩm bán nhiều nhất và tổng số sản phẩm đã bán trong tháng
    res.status(200).json({
      data: result[0], // Kết quả của aggregation
      error: false,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy dữ liệu.',
      error: true,
      details: error.message,
    });
  }
};

export const getLatestOrders = async (req, res) => {
  try {
    const {
      orderStatus, // orderStatus is an objectid.
      startDate,
      endDate,
      userRole, // enum: ['staff', 'customer']
    } = req.query;

    const query = {};

    // Kiểm tra orderStatus
    if (orderStatus && isValidObjectId(orderStatus)) {
      query.orderStatus = orderStatus;
    }

    // Kiểm tra khoảng thời gian
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Kiểm tra userRole
    if (userRole) {
      if (userRole.toString().toLowerCase() === 'admin') {
        return res.status(400).json({
          error: 'Only accept customer and staff for filter condition',
        });
      }

      // Find users with the specified role
      const usersWithRole = await User.find({
        role: userRole.toLowerCase(),
      }).select('_id');

      if (!usersWithRole || usersWithRole.length === 0) {
        return res.status(400).json({
          error: 'No users found with the specified role',
        });
      }

      query.user = { $in: usersWithRole.map((user) => user._id) };
    }

    // Tìm 10 đơn hàng gần nhất
    const orders = await Order.find(query)
      .populate('user', 'fullname')
      .populate('shippingAddress', '-isDefault -phone')
      .populate({
        path: 'orderDetail',
        model: 'CartDetail',
        populate: {
          path: 'product',
          select: 'productName productImagePath',
        },
      })
      .populate('orderStatus')
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
      .limit(10); // Giới hạn số lượng đơn hàng trả về

    // Trả về kết quả
    res.status(200).json({
      data: orders,
      error: false,
    });
  } catch (error) {
    logError(error, res);
  }
};
