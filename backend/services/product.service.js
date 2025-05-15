import { Product, ProductType } from '../models/product.model.js';
import { NotFoundError } from '../utils/Error.js';
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
      traits,
      mbti,
      searchString,
      sortBy = 'createdAt',
      isDesc = false,
    } = query;

    const filters = [];

    // Partial Traits Match (OR logic)
    if (traits) {
      const traitList = Array.isArray(traits) ? traits : traits.split(',');
      filters.push({ traits: { $in: traitList } });
    }

    // MBTI (OR logic)
    if (mbti) {
      const recommendedTypeList = Array.isArray(mbti) ? mbti : mbti.split(',');
      filters.push({ recommendedTypes: { $in: recommendedTypeList } });
    }

    // Full-Text Search
    if (searchString) {
      filters.push({ $text: { $search: searchString } });
    }

    // Merge filters with OR logic if multiple filters are present
    const finalFilter = filters.length > 0 ? { $or: filters } : {};

    // Sorting
    const sortDirection = isDesc === 'true' ? -1 : 1;
    const sortOptions = { [sortBy]: sortDirection };

    // Fetch Products
    const products = await Product.find(finalFilter)
      .populate({
        path: 'productType',
        select: 'productTypeName',
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOptions)
      .exec();

    // Total Count
    const totalDocs = await Product.countDocuments(finalFilter);
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
      throw new NotFoundError('Product not found');
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
