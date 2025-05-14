import productService from '../services/product.service.js';
import logError from '../utils/logError.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      productImagePath: req.files?.map((file) => file.path) || [],
    };
    const product = await productService.createProduct(productData);
    res.status(201).json({
      data: product,
      error: false,
      message: 'Product created successfully!',
    });
  } catch (error) {
    logError(error, res);
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { traits, recommendedTypes, ...restQuery } = req.query;

    // Ensure traits and recommendedTypes are properly parsed as arrays
    const parsedTraits = Array.isArray(traits)
      ? traits
      : traits
      ? traits.split(',')
      : [];
    const parsedRecommendedTypes = Array.isArray(recommendedTypes)
      ? recommendedTypes
      : recommendedTypes
      ? recommendedTypes.split(',')
      : [];

    // Combine the remaining query parameters
    const query = {
      ...restQuery,
      traits: parsedTraits.length > 0 ? parsedTraits : undefined,
      recommendedTypes:
        parsedRecommendedTypes.length > 0 ? parsedRecommendedTypes : undefined,
    };

    const data = await productService.getAllProducts(query);
    res.status(200).json({
      data: data.products,
      error: false,
      meta: {
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        limit: data.limit,
      },
    });
  } catch (error) {
    logError(error, res);
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ data: product, error: false });
  } catch (error) {
    logError(error, res);
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      productImagePath: req.files?.map((file) => file.path) || [],
    };
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      updatedData
    );
    res.status(200).json({
      data: updatedProduct,
      error: false,
      message: 'Product updated successfully!',
    });
  } catch (error) {
    logError(error, res);
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json({
      data: result,
      error: false,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    logError(error, res);
  }
};
