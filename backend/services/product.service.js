import { Product, ProductType } from '../models/product.model.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';

class ProductService {
  // Create a new product
  async createProduct(productData) {
    const { productType, productName, countInStock, price, description } =
      productData;

    if (!productName || !countInStock || !price || !description) {
      throw new Error('Missing required fields!');
    }

    if (productType && !isValidObjectId(productType)) {
      throw new Error('Invalid Product Type ID');
    }

    // Check if the product type exists
    if (productType) {
      const existingType = await ProductType.findById(productType);
      if (!existingType) {
        throw new Error('Product type not found');
      }
    }

    const product = new Product(productData);
    await product.save();
    return product;
  }

  // Get all products with pagination and optional filtering
  async getAllProducts(query = {}) {
    const { page = 1, limit = 10, productType } = query;

    const filters = {};
    if (productType && isValidObjectId(productType)) {
      filters.productType = productType;
    }

    const products = await Product.find(filters)
      .populate('productType', 'productTypeName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    const totalDocs = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      products,
      totalDocs,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
  }

  // Get a single product by ID
  async getProductById(productId) {
    if (!isValidObjectId(productId)) {
      throw new Error('Invalid Product ID');
    }

    const product = await Product.findById(productId).populate(
      'productType',
      'productTypeName'
    );
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Update product details
  async updateProduct(productId, updatedData) {
    if (!isValidObjectId(productId)) {
      throw new Error('Invalid Product ID');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('productType', 'productTypeName');

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  }

  // Delete a product
  async deleteProduct(productId) {
    if (!isValidObjectId(productId)) {
      throw new Error('Invalid Product ID');
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new Error('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }
}

export default new ProductService();
