import ApiService from "./api.service";

class OrderStatusService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/order-status");
  }

  async getAllStatuses() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.error || "Error fetching order statuses"
      );
    }
  }
}

export default new OrderStatusService();
