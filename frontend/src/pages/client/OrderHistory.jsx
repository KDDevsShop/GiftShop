import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Datatable from "../../components/Datatable";
import orderService from "../../services/order.service";
import ProductsService from "../../services/product.service";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrderByUser(1, 1000);

      const formatted = response.map((order, index) => ({
        id: order._id,
        no: index + 1,
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        totalPrice: order.totalPrice,
        status: order.orderStatus?.orderStatus || "Processing",
        full: order,
      }));
      setOrders(formatted);
    } catch (err) {
      console.error("Failed to fetch customer orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = async (row) => {
    const order = row.full;

    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const columns = useMemo(
    () => [
      { field: "no", headerName: "No.", flex: 0.4 },
      { field: "orderDate", headerName: "Order Date", flex: 1 },
      {
        field: "totalPrice",
        headerName: "Total",
        flex: 1,
        type: "number",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1.2,
      },
    ],
    []
  );

  return (
    <Box>
      <Datatable
        title="My Orders"
        rows={orders}
        columns={columns}
        loading={loading}
        onView={handleView}
      />

      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Order Detail</DialogTitle>
        <DialogContent dividers>
          {selectedOrder ? (
            <Stack spacing={2}>
              <Typography>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Total Price:</strong> $
                {selectedOrder.totalPrice.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                {selectedOrder.orderStatus?.orderStatus}
              </Typography>
              <Typography>
                <strong>Shipping Address:</strong>{" "}
                {selectedOrder.shippingAddress
                  ? `${selectedOrder.shippingAddress.commune}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.province}`
                  : "N/A"}
              </Typography>
              <Typography>
                <strong>Items:</strong>
              </Typography>
              <ul>
                {(selectedOrder.orderDetail || []).map((item, i) => (
                  <li key={i}>
                    {item.product?.productName || "Unknown item"} x{" "}
                    {item.quantity}
                  </li>
                ))}
              </ul>
            </Stack>
          ) : (
            <Typography>No order selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderHistory;
