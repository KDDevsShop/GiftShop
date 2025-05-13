import React, { useEffect, useState } from 'react';
import AdminLayout from './../../layouts/AdminLayout.jsx';
import ProductTypeService from '../../services/productType.service';
import Datatable from '../../components/Datatable';
import { useNavigate } from 'react-router-dom';

const ProductTypeList = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await ProductTypeService.getAll();
        setProductTypes(data);
      } catch (err) {
        setError('Failed to load product types');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  const handleAdd = () => {
    navigate('/admin/product-types/create');
  };

  const handleView = (row) => {
    navigate(`/admin/product-types/${row.id}`);
  };

  const handleEdit = (row) => {
    navigate(`/admin/product-types/${row.id}/edit`);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure to delete "${row.productTypeName}"?`))
      return;

    try {
      await ProductTypeService.delete(
        row.id,
        localStorage.getItem('accessToken')
      );
      setProductTypes((prev) => prev.filter((item) => item.id !== row.id));
    } catch (err) {
      alert('Failed to delete product type.');
      console.error(err);
    }
  };

  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 100,
    },
    {
      field: 'productTypeName',
      headerName: 'Product Type Name',
      flex: 1,
    },
  ];

  const rows = productTypes.map((pt, index) => ({
    id: pt._id,
    no: index + 1,
    productTypeName: pt.productTypeName,
  }));

  return (
    <AdminLayout>
      <Datatable
        title='Product Types'
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminLayout>
  );
};

export default ProductTypeList;
