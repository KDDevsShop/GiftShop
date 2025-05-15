import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const ProductTypeFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const [productTypeName, setProductTypeName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setProductTypeName(initialData.productTypeName || "");
    } else {
      setProductTypeName("");
    }
    setError("");
  }, [initialData, open]);

  const handleChange = (e) => {
    const value = e.target.value;
    setProductTypeName(value);

    // Clear error live if input becomes valid
    if (value.trim()) {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!productTypeName.trim()) {
      setError("Product type name is required");
      return;
    }

    onSubmit({ productTypeName: productTypeName.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit Product Type" : "Add Product Type"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Product Type Name"
          value={productTypeName}
          onChange={handleChange}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#6a1b9a",
            "&:hover": {
              backgroundColor: "#4a148c",
            },
          }}
          variant="contained"
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductTypeFormModal;
