import ApiService from './api.service';

class UserService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/users');
  }

  async getUserById(id) {
    try {
      const response = await this.api.get(`?id=${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error || 'Error fetching user data');
    }
  }

  async getLoggedInUser(accessToken) {
    try {
      // console.log(accessToken);
      const response = await this.api.get('/current', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log('Logged-in user data:', response.data.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Error fetching logged-in user data'
      );
    }
  }

  async updateUserInfo(updatedData, accessToken) {
    try {
      const response = await this.api.put('/', updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Error updating user information'
      );
    }
  }

  async updatePassword(updatedData, accessToken) {
    try {
      const response = await this.api.put('/update-password', updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error updating password');
    }
  }

  async changeAvatar(avatarFile, accessToken) {
    try {
      const formData = new FormData();
      formData.append('avatarImagePath', avatarFile);

      const response = await this.api.put('/update-avatar', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error changing avatar');
    }
  }
}

export default new UserService();
