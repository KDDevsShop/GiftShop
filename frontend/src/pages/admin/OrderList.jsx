import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Chip,
  Stack,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Datatable from "../../components/Datatable";
import orderService from "../../services/order.service";
import orderStatusService from "../../services/orderStatus.service";
import ProductsService from "../../services/product.service";

const OrderList = () => {
  const [statusOptions, setStatusOptions] = useState([]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = await orderStatusService.getAllStatuses();

        setStatusOptions(
          statuses.map((status) => ({
            label: status.orderStatus,
            value: status._id,
          }))
        );
      } catch (err) {
        console.error("Failed to load order statuses", err);
      }
    };

    fetchStatuses();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(1000);

      const formatted = response.map((order, index) => ({
        id: order._id,
        no: index + 1,
        user: order.user?.fullname || "Unknown",
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        totalPrice: order.totalPrice,
        status: order.orderStatus?.orderStatus || "Processing",
        statusId: order.orderStatus?._id,
        orderDetail: order.orderDetail,
        full: order, // for modal
      }));
      console.log("formatted", formatted);
      setOrders(formatted);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = async (row) => {
    const order = row.full;
    console.log("order", order);
    const detailedItems = await Promise.all(
      order.orderDetail.map(async (item) => {
        try {
          const response = await ProductsService.getProductById(item.product);
          console.log("response", response);
          return {
            ...item,
            product: response.data,
          };
        } catch (err) {
          console.error("Failed to fetch product", err);
          return {
            ...item,
            product: { name: "Unknown item" },
          };
        }
      })
    );

    setSelectedOrder({
      ...order,
      orderDetail: detailedItems,
    });

    setViewModalOpen(true);
  };

  const handleStatusChange = async (newStatusId, row) => {
    try {
      await orderService.updateOrderStatus(row.id, newStatusId);
      fetchOrders(); // Refresh after update
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const columns = useMemo(
    () => [
      { field: "no", headerName: "No.", flex: 0.4 },
      { field: "user", headerName: "Customer", flex: 1 },
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
        align: "center",
        renderCell: (params) => (
          <Select
            value={params.row.statusId}
            size="small"
            onChange={(e) => handleStatusChange(e.target.value, params.row)}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        ),
      },
    ],
    [statusOptions]
  );

  return (
    <Box>
      <Datatable
        title="Order Management"
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
                <strong>Customer:</strong> {selectedOrder.user?.fullname}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedOrder.user?.email}
              </Typography>
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
                    {item.product?.name || "Unknown item"} x {item.quantity}
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

export default OrderList;
