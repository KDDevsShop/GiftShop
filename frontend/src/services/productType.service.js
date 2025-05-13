import ApiService from "./api.service";

class ProductTypeService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/product-types");
  }

  async getAll() {
    try {
      const response = await this.api.request("/", "GET");
      return response.data;
    } catch (error) {
      console.error("Error fetching product types:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await this.api.request(`/${id}`, "GET");
      return response.data;
    } catch (error) {
      console.error(`Error fetching product type with ID ${id}:`, error);
      throw error;
    }
  }

  async create(data, token) {
    try {
      const response = await this.api.request("/", "POST", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product type:", error);
      throw error;
    }
  }

  async update(id, data, token) {
    try {
      const response = await this.api.request(`/${id}`, "PUT", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product type with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id, token) {
    try {
      const response = await this.api.request(`/${id}`, "DELETE", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product type with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new ProductTypeService();
