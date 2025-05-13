const BASE_URL = 'http://localhost:5000/api/address';

class OpenApiService {
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching data from server');
      }

      return await response.json();
    } catch (error) {
      console.error('OpenApiService Error:', error);
      throw new Error(error.message || 'Error fetching data from server');
    }
  }

  async getProvinces() {
    const data = await this.fetchData('/provinces');
    return data.data || [];
  }

  async getDistricts(code) {
    const data = await this.fetchData(`/districts/${code}`);
    return data.data || [];
  }

  async getWards(code) {
    const data = await this.fetchData(`/wards/${code}`);
    return data.data || [];
  }
}

export default new OpenApiService();
