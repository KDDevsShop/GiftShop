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
      <Stack direction="row" spacing={1} padding={1}>
        {onView && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => onView(params.row)}
          >
            View
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outlined"
            size="small"
            color="warning"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => onDelete(params.row)}
          >
            Delete
          </Button>
        )}
      </Stack>
    ),
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {onAdd && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6a1b9a", // deep purple
              "&:hover": {
                backgroundColor: "#4a148c",
              },
            }}
            onClick={onAdd}
          >
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
        <div style={{ height: 650, width: "100%" }}>
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
