import ApiService from './api.service';

class OrderService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/order');
  }

  async createOrder(order) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await this.api.post('/', order, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.data.error || 'Error creating order');
    }
  }

  async getOrderByUser(page, limit, orderStatus, isLatest) {
    const params = new URLSearchParams();

    // Thêm tham số phân trang vào URLSearchParams
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (orderStatus) params.append('orderStatus', orderStatus);
    if (isLatest) params.append('isLatest', isLatest);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await this.api.get(`/user?${params.toString()}`, {
        params: params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error fetching order list');
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await this.api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error fetching order');
    }
  }

  async updateOrderStatus(orderId, orderStatusId) {
    try {
      const response = await this.api.put(`/${orderId}/status`, {
        orderStatus: orderStatusId,
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  }

  async getOrders(limit = 0) {
    const params = new URLSearchParams();
    params.append('limit', limit);
    try {
      const response = await this.api.request(`?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      throw error;
    }
  }
}

export default new OrderService();
