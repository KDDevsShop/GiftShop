import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

const urlImage = "http://localhost:5000/";

const ProductDetailModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">{product.productName}</Typography>
        <img
          src={`${urlImage}${product.productImagePath?.[0]}`}
          alt={product.productName}
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "contain",
            marginBottom: 10,
          }}
        />
        <Typography>
          <strong>Price:</strong> ${product.price}
        </Typography>
        <Typography>
          <strong>Stock:</strong> {product.countInStock}
        </Typography>
        <Typography>
          <strong>Type:</strong> {product.productType?.productTypeName}
        </Typography>
        <Typography>
          <strong>Description:</strong> {product.description}
        </Typography>

        <Typography mt={2}>
          <strong>Recommended MBTI Types:</strong>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          {product.recommendedTypes?.map((type) => (
            <Chip key={type} label={type} />
          ))}
        </Stack>

        <Typography mt={2}>
          <strong>Keywords:</strong>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          {product.keywords?.map((kw) => (
            <Chip key={kw} label={kw} variant="outlined" />
          ))}
        </Stack>

        <Typography mt={2}>
          <strong>Traits:</strong>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          {product.traits?.map((trait) => (
            <Chip key={trait} label={trait} color="secondary" />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailModal;
