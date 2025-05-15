import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";

const UserViewModal = ({ open, onClose, user }) => {
  if (!user) return null;

  console.log("User:", user);

  const gender = user.gender
    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    : "N/A";
  const dob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString()
    : "N/A";
  const baseUrl = "http://localhost:5000/";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} alignItems="center" mb={3}>
          <Avatar
            alt={user.fullname}
            src={user.avatar ? `${baseUrl}${user.avatar}` : ""}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h6">{user.fullname}</Typography>
          <Typography color="textSecondary">{user.email}</Typography>
          <Chip label={user.role.role} />
        </Stack>

        <Typography>
          <strong>Phone:</strong> {user.phone || "N/A"}
        </Typography>
        <Typography>
          <strong>Gender:</strong> {gender}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {dob}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserViewModal;
