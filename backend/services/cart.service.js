import { Cart } from '../models/cart.model.js';
import { CartDetail } from '../models/cartDetail.model.js';
import { Product } from '../models/product.model.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';
import { getTotalPrice, getTotalItems } from '../utils/cartCalculations.js';

class CartService {
  async getCartByUser(userId) {
    if (!isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }

    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'cartItems',
        populate: {
          path: 'product',
          model: 'Product',
          select: 'productName discountedPrice productImagePath',
        },
        select: 'quantity itemPrice',
      })
      .populate('userId', 'fullname -_id');

    if (!cart) {
      throw new Error('Cart Not Found');
    }

    return {
      cart,
      totalPrice: getTotalPrice(cart.cartItems),
      totalCartItems: getTotalItems(cart.cartItems),
    };
  }

  async addToCart(userId, productId, quantity) {
    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      throw new Error('Invalid Id');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ userId }).populate('cartItems');

    if (!cart) {
      cart = new Cart({ userId, cartItems: [] });
    }

    const productIndex = cart.cartItems.findIndex((item) =>
      item.product.equals(productId)
    );

    if (productIndex === -1) {
      const newCartItem = new CartDetail({
        product: productId,
        quantity,
        itemPrice: product.discountedPrice * quantity,
      });

      await newCartItem.save();
      cart.cartItems.push(newCartItem);
    } else {
      const existingCartItem = cart.cartItems[productIndex];
      existingCartItem.quantity += quantity;
      existingCartItem.itemPrice += product.discountedPrice * quantity;
      await existingCartItem.save();
    }

    await cart.save();

    return {
      cart,
      totalPrice: getTotalPrice(cart.cartItems),
      totalCartItems: getTotalItems(cart.cartItems),
    };
  }

  async deleteFromCart(userId, productId) {
    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      throw new Error('Invalid Id');
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error('Cart does not exist');
    }

    const itemIndex = cart.cartItems.findIndex((item) =>
      item.equals(productId)
    );

    if (itemIndex === -1) {
      throw new Error('Product not found in cart');
    }

    await CartDetail.findByIdAndDelete(productId);
    cart.cartItems.splice(itemIndex, 1);
    await cart.save();

    return {
      cart,
      totalPrice: getTotalPrice(cart.cartItems),
      totalCartItems: getTotalItems(cart.cartItems),
    };
  }

  async deleteAllFromCart(userId) {
    if (!isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await CartDetail.deleteMany({ _id: { $in: cart.cartItems } });
    await Cart.findByIdAndDelete(cart._id);

    return { message: 'Cart deleted successfully' };
  }

  async changeItemQuantity(userId, productId, quantity) {
    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      throw new Error('Invalid Id');
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = cart.cartItems.find((item) => item.equals(productId));

    if (!cartItem) {
      throw new Error('Product not found in cart');
    }

    if (quantity === 0) {
      await CartDetail.findByIdAndDelete(productId);
      cart.cartItems.pull(productId);
    } else {
      cartItem.quantity = quantity;
      cartItem.itemPrice = (cartItem.itemPrice / cartItem.quantity) * quantity;
      await cartItem.save();
    }

    await cart.save();

    return {
      cart,
      totalPrice: getTotalPrice(cart.cartItems),
      totalCartItems: getTotalItems(cart.cartItems),
    };
  }

  async getCartDetail(cartDetailId) {
    if (!isValidObjectId(cartDetailId)) {
      throw new Error('Invalid Id');
    }

    const cartDetail = await CartDetail.findById(cartDetailId).populate({
      path: 'product',
      model: 'Product',
      select: 'productName discountedPrice productImagePath',
    });

    if (!cartDetail) {
      throw new Error('Cart detail not found');
    }

    return cartDetail;
  }
}

export default new CartService();
