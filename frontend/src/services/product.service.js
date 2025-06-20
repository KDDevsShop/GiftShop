import apiService from "./api.service";

class ProductsService {
  constructor() {
    this.api = new apiService("http://localhost:5000/api/products");
  }

  async getProducts(query = {}, page, limit, sortBy) {
    console.log(query?.toString());
    if (!(query instanceof URLSearchParams)) {
      query = new URLSearchParams(query);
    }

    if (page) query.append("page", page);
    if (limit) query.append("limit", limit);

    if (sortBy) query.append("sortBy", sortBy);

    try {
      const response = await this.api.get(`/?${query && query.toString()}`);
      return response;
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response);
        throw new Error(
          `Request failed with status code ${error.response.status}: ${
            error.response.data?.error || "Unknown error"
          }`
        );
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error request:", error.request);
        throw new Error("No response received from server.");
      } else {
        // Other errors (e.g., network issue)
        console.error("Error message:", error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  async getProductById(id) {
    try {
      const response = await this.api.request(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  }

  async createProduct(product) {
    try {
      const formData = new FormData();

      formData.append("productName", product.productName);
      formData.append("price", product.price);
      formData.append("countInStock", product.countInStock);
      formData.append("description", product.description);
      formData.append("productType", product.productType);

      // Append multiple images
      product.productImagePath.forEach((file) => {
        formData.append("productImages", file);
      });

      // Append arrays as JSON strings
      product.recommendedTypes.forEach((type) => {
        formData.append("recommendedTypes", type);
      });
      product.keywords.forEach((keyword) => {
        formData.append("keywords", keyword);
      });

      product.traits.forEach((trait) => {
        formData.append("traits", trait);
      });

      const response = await this.api.request("/", "POST", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  }

  async updateProduct(id, product) {
    try {
      const formData = new FormData();

      formData.append("productName", product.productName);
      formData.append("price", product.price);
      formData.append("countInStock", product.countInStock);
      formData.append("description", product.description);
      formData.append("productType", product.productType);

      // Append multiple images (if any)
      product.productImagePath.forEach((file) => {
        formData.append("productImages", file);
      });

      product.recommendedTypes.forEach((type) => {
        formData.append("recommendedTypes", type);
      });
      product.keywords.forEach((keyword) => {
        formData.append("keywords", keyword);
      });

      product.traits.forEach((trait) => {
        formData.append("traits", trait);
      });

      const response = await this.api.request(`/${id}`, "PUT", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await this.api.request(`/${id}`, "DELETE");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  }

  async uploadImage(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const response = await this.api.request(
        "/upload-image",
        "POST",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      throw error;
    }
  }
}

export default new ProductsService();
