import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Chip,
  Stack,
  Box,
  Typography,
} from "@mui/material";

const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
];

const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  productTypes = [],
}) => {
  const [form, setForm] = useState({
    productName: "",
    price: "",
    countInStock: "",
    description: "",
    productType: "",
    productImagePath: [],
    recommendedTypes: [],
    keywords: [],
    traits: [],
  });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      if (
        initialData.productImagePath &&
        Array.isArray(initialData.productImagePath)
      ) {
        setImagePreviews(
          initialData.productImagePath.map((img) => ({
            src: img.startsWith("http") ? img : `http://localhost:5000/${img}`,
            file: null, // existing image
          }))
        );
      }

      setForm({
        ...initialData,
        productType:
          initialData.productType?._id || initialData.productType || "",
      });
    } else {
      setForm({
        productName: "",
        price: "",
        countInStock: "",
        description: "",
        productType: "",
        productImagePath: [],
        recommendedTypes: [],
        keywords: [],
        traits: [],
      });
      setImagePreviews([]);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};
    if (!form.productName) newErrors.productName = "Product name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.countInStock) newErrors.countInStock = "Stock count is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.productType) newErrors.productType = "Product type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      src: URL.createObjectURL(file),
      file,
    }));

    setImagePreviews(newPreviews);
    setForm({ ...form, productImagePath: files });
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setImagePreviews([]);
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Product Name"
          margin="normal"
          value={form.productName}
          onChange={(e) => handleChange("productName", e.target.value)}
          error={!!errors.productName}
          helperText={errors.productName}
        />

        <TextField
          fullWidth
          type="number"
          label="Price"
          margin="normal"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          error={!!errors.price}
          helperText={errors.price}
        />

        <TextField
          fullWidth
          type="number"
          label="Count In Stock"
          margin="normal"
          value={form.countInStock}
          onChange={(e) => handleChange("countInStock", e.target.value)}
          error={!!errors.countInStock}
          helperText={errors.countInStock}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          margin="normal"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          select
          fullWidth
          label="Product Type"
          margin="normal"
          value={form.productType}
          onChange={(e) => handleChange("productType", e.target.value)}
          error={!!errors.productType}
          helperText={errors.productType}
        >
          {productTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.productTypeName}
            </MenuItem>
          ))}
        </TextField>

        <Box mt={2}>
          <Typography variant="subtitle1">Recommended MBTI Types</Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1} mt={1}>
            {MBTI_TYPES.map((type) => (
              <Chip
                key={type}
                label={type}
                color={
                  form.recommendedTypes.includes(type) ? "primary" : "default"
                }
                onClick={() =>
                  handleChange(
                    "recommendedTypes",
                    form.recommendedTypes.includes(type)
                      ? form.recommendedTypes.filter((t) => t !== type)
                      : [...form.recommendedTypes, type]
                  )
                }
              />
            ))}
          </Stack>
        </Box>

        <TextField
          fullWidth
          label="Keywords (comma separated)"
          margin="normal"
          value={form.keywords?.join(", ")}
          onChange={(e) =>
            handleChange(
              "keywords",
              e.target.value.split(",").map((kw) => kw.trim())
            )
          }
        />

        <TextField
          fullWidth
          label="Traits (comma separated)"
          margin="normal"
          value={form.traits?.join(", ")}
          onChange={(e) =>
            handleChange(
              "traits",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
        />

        <Box mt={2}>
          <Typography variant="subtitle1">Upload Images</Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ marginTop: 8 }}
          />
          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {imagePreviews.map((preview, idx) => (
              <Box
                key={idx}
                component="img"
                src={`${preview.src}`}
                alt={`Preview ${idx}`}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#6a1b9a",
            "&:hover": { backgroundColor: "#4a148c" },
          }}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;
