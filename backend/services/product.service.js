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
    const {
      page = 1,
      limit = 10,
      productType,
      traits,
      recommendedTypes,
      searchString,
      sortBy = 'createdAt',
      isDesc = false,
    } = query;

    const filters = {};

    console.log('isValidObjectId(productType) ', isValidObjectId(productType));

    if (productType && isValidObjectId(productType)) {
      filters.productType = productType;
    }

    if (traits) {
      const traitList = Array.isArray(traits) ? traits : traits.split(',');
      filters.traits = { $all: traitList };
    }

    if (recommendedTypes) {
      const recommendedTypeList = Array.isArray(recommendedTypes)
        ? recommendedTypes
        : recommendedTypes.split(',');
      filters.recommendedTypes = { $in: recommendedTypeList };
    }

    if (searchString) {
      filters.$text = { $search: searchString };
    }

    const sortDirection = isDesc === 'true' ? -1 : 1;
    const sortOptions = { [sortBy]: sortDirection };

    // Fetch Products
    const products = await Product.find(filters)
      .populate('productType', 'productTypeName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOptions)
      .exec();

    // Total Count
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
