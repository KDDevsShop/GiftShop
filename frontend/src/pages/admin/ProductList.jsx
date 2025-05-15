import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import Datatable from "../../components/Datatable";
import ProductsService from "../../services/product.service.js";
import ProductFormModal from "../../components/Products/ProductFormModal";
import ProductDetailModal from "../../components/Products/ProductDetailModal";
import ProductTypeService from "../../services/productType.service.js"; // Assuming you have this

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await ProductsService.getProducts(null, 1, 1000, null);
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const res = await ProductTypeService.getAll();
      console.log(res);
      setProductTypes(res);
    } catch (err) {
      console.error("Failed to fetch product types:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, []);

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setFormModalOpen(true);
  };

  const handleClose = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setFormModalOpen(false);
  };

  const handleView = (row) => {
    const product = products.find((p) => p._id === row.id);
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEdit = (row) => {
    const product = products.find((p) => p._id === row.id);
    setSelectedProduct(product);
    setIsEditMode(true);
    setFormModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (
      !window.confirm(`Are you sure you want to delete '${row.productName}'?`)
    )
      return;
    try {
      await ProductsService.deleteProduct(row.id);
      setProducts((prev) => prev.filter((item) => item._id !== row.id));
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (isEditMode && selectedProduct) {
        await ProductsService.updateProduct(selectedProduct._id, data);
      } else {
        await ProductsService.createProduct(data);
      }
      setFormModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
      console.error(err);
    }
  };

  const columns = [
    { field: "no", headerName: "No.", width: 80 },
    { field: "productName", headerName: "Product Name", flex: 1 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "productType", headerName: "Type", width: 150 },
  ];

  const rows = products.map((p, index) => ({
    id: p._id,
    no: index + 1,
    productName: p.productName,
    price: `$${p.price.toFixed(2)}`,
    productType: p.productType?.productTypeName || "N/A",
  }));

  console.log(productTypes);

  return (
    <AdminLayout>
      <Datatable
        title="Products"
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDetailModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        product={selectedProduct}
      />

      <ProductFormModal
        open={formModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmitForm}
        initialData={selectedProduct}
        isEdit={isEditMode}
        productTypes={productTypes}
      />
    </AdminLayout>
  );
};

export default ProductList;
