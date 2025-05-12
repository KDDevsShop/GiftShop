import { ProductType } from '../models/product.model.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';

class ProductTypeService {
  async createProductType(productTypeName) {
    if (!productTypeName) {
      throw new Error('Product type name is required');
    }

    const existingProductType = await ProductType.findOne({ productTypeName });
    if (existingProductType) {
      throw new Error('Product type already exists');
    }

    const newProductType = await ProductType.create({ productTypeName });
    return newProductType;
  }

  async getAllProductTypes() {
    const productTypes = await ProductType.find();
    if (productTypes.length === 0) {
      throw new Error('No product types found');
    }
    return productTypes;
  }

  async getProductTypeById(id) {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid product type ID');
    }

    const productType = await ProductType.findById(id);
    if (!productType) {
      throw new Error('Product type not found');
    }

    return productType;
  }

  async updateProductType(id, productTypeName) {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid product type ID');
    }

    if (!productTypeName) {
      throw new Error('Product type name is required');
    }

    const updatedProductType = await ProductType.findByIdAndUpdate(
      id,
      { productTypeName },
      { new: true, runValidators: true }
    );

    if (!updatedProductType) {
      throw new Error('Product type not found');
    }

    return updatedProductType;
  }

  async deleteProductType(id) {
    if (!isValidObjectId(id)) {
      throw new Error('Invalid product type ID');
    }

    const deletedProductType = await ProductType.findByIdAndDelete(id);
    if (!deletedProductType) {
      throw new Error('Product type not found');
    }

    return deletedProductType;
  }
}

export default new ProductTypeService();
