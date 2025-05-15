import React, { useEffect, useState } from "react";
import AdminLayout from "./../../layouts/AdminLayout.jsx";
import ProductTypeService from "../../services/productType.service";
import Datatable from "../../components/Datatable";
import ProductTypeFormModal from "./../../components/ProductTypes/ProductTypeFormModal";
import ProductTypeViewModal from "./../../components/ProductTypes/ProductTypeViewModal";

const ProductTypeList = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const data = await ProductTypeService.getAll();
      setProductTypes(data);
    } catch (err) {
      setError("Failed to load product types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const handleAdd = () => {
    setIsEdit(false);
    setEditData(null);
    setOpenForm(true);
  };

  const handleView = (row) => {
    const selected = productTypes.find((pt) => pt._id === row.id);
    setViewData(selected);
    setOpenView(true);
  };

  const handleEdit = (row) => {
    const selected = productTypes.find((pt) => pt._id === row.id);
    setEditData(selected);
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure to delete "${row.productTypeName}"?`))
      return;
    try {
      await ProductTypeService.delete(
        row.id,
        localStorage.getItem("accessToken")
      );
      fetchProductTypes();
    } catch (err) {
      alert("Failed to delete product type.");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEdit && editData) {
        await ProductTypeService.update(
          editData._id,
          formData,
          localStorage.getItem("accessToken")
        );
      } else {
        await ProductTypeService.create(
          formData,
          localStorage.getItem("accessToken")
        );
      }
      setOpenForm(false);
      fetchProductTypes();
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("Error submitting form");
    }
  };

  const columns = [
    { field: "no", headerName: "No.", width: 100 },
    { field: "productTypeName", headerName: "Product Type Name", flex: 1 },
  ];

  const rows = productTypes.map((pt, index) => ({
    id: pt._id,
    no: index + 1,
    productTypeName: pt.productTypeName,
  }));

  return (
    <AdminLayout>
      <Datatable
        title="Product Types"
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      <ProductTypeFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editData}
        isEdit={isEdit}
      />

      {/* View Modal */}
      {viewData && (
        <ProductTypeViewModal
          open={openView}
          onClose={() => setOpenView(false)}
          data={viewData}
        />
      )}
    </AdminLayout>
  );
};

export default ProductTypeList;
