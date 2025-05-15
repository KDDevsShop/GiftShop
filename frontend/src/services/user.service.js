import ApiService from "./api.service";

class UserService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/users");
  }

  async getAllUsers(limit = 0) {
    try {
      const params = new URLSearchParams();
      params.append("limit", limit);
      return await this.api.get(`?${params.toString()}`);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tất cả người dùng: ", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await this.api.get(`?id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error || "Error fetching user data");
    }
  }

  async getLoggedInUser(accessToken) {
    try {
      // console.log(accessToken);
      const response = await this.api.get("/current", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log('Logged-in user data:', response.data.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error fetching logged-in user data"
      );
    }
  }

  async updateUserInfo(updatedData, accessToken) {
    try {
      const response = await this.api.put("/", updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error updating user information"
      );
    }
  }

  async updatePassword(updatedData, accessToken) {
    try {
      const response = await this.api.put("/update-password", updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error updating password");
    }
  }

  async changeAvatar(avatarFile, accessToken) {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await this.api.put("/avatar", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error changing avatar");
    }
  }
}

export default new UserService();
