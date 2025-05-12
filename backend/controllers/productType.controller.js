import productTypeService from '../services/productType.service.js';
import logError from '../utils/logError.js';

export const createProductType = async (req, res) => {
  try {
    const { productTypeName } = req.body;
    const newProductType = await productTypeService.createProductType(
      productTypeName
    );
    res.status(201).json({ data: newProductType, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await productTypeService.getAllProductTypes();
    res.status(200).json({ data: productTypes, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getProductTypeById = async (req, res) => {
  try {
    const productType = await productTypeService.getProductTypeById(
      req.params.id
    );
    res.status(200).json({ data: productType, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { productTypeName } = req.body;
    const updatedProductType = await productTypeService.updateProductType(
      req.params.id,
      productTypeName
    );
    res.status(200).json({ data: updatedProductType, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const deleteProductType = async (req, res) => {
  try {
    const deletedProductType = await productTypeService.deleteProductType(
      req.params.id
    );
    res.status(200).json({ data: deletedProductType, error: false });
  } catch (error) {
    logError(error, res);
  }
};
