import ApiService from './api.service';

class CartService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/cart');
  }

  async getCartByUser(accessToken) {
    return (
      await this.api.get('/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  async addToCart(accessToken, data) {
    return (
      await this.api.post('/add', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  async createCartDetail(accessToken, data) {
    return (
      await this.api.post('/add-detail', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  async getCartDetail(id) {
    return (await this.api.get(`/cart-detail/${id}`)).data;
  }

  async updateQuantity(accessToken, data) {
    return (
      await this.api.put('/update-quantity', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  async deleteItem(accessToken, id) {
    return (
      await this.api.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  async deleteAll(accessToken) {
    return (
      await this.api.delete('/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }
}

export default new CartService();
