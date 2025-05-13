import ApiService from "./api.service";

class AuthService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/auth");
  }

  async login(data) {
    try {
      const response = await this.api.request("/login", "POST", data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      throw error;
    }
  }

  async signup(data) {
    try {
      const formData = new FormData();

      // Assuming `data` contains keys: imageFile, username, email, password, etc.
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await this.api.request("/signup", "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error when signing up:", error);
      throw error;
    }
  }
}
export default new AuthService();
