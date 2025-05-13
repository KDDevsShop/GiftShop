import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";

const Datatable = ({
  title,
  rows,
  columns,
  loading,
  error,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  // Append action column
  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 300,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => onView && onView(params.row)}
        >
          View
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="warning"
          onClick={() => onEdit && onEdit(params.row)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onDelete && onDelete(params.row)}
        >
          Delete
        </Button>
      </Stack>
    ),
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {onAdd && (
          <Button variant="contained" color="primary" onClick={onAdd}>
            Add New
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={[...columns, actionColumn]}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>
      )}
    </Box>
  );
};

export default Datatable;
