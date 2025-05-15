import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import userService from "../../services/user.service";
import Datatable from "../../components/Datatable.jsx";
import UserViewModal from "../../components/UserViewModal.jsx";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        console.log(response.data);
        const formattedUsers = response.data.map((user, index) => ({
          _id: user._id,
          id: index + 1,
          avatar: user.avatarImagePath,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          phone: user.phone,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
        }));
        setUsers(formattedUsers);
      } catch (err) {
        setError("Failed to load users");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleView = (row) => {
    const user = users.find((p) => p._id === row._id); // Use _id
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const rows = useMemo(
    () =>
      users.map((user, index) => ({
        id: index + 1,
        ...user,
      })),
    [users]
  );

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "No.",
        flex: 0.5,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "fullname",
        headerName: "Fullname",
        flex: 1,
        align: "left",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        align: "left",
      },
      {
        field: "role.role",
        headerName: "Role",
        flex: 1,
        align: "left",
        renderCell: (params) => {
          const roleMap = {
            admin: "Admin",
            customer: "Customer",
            staff: "Staff",
          };
          return roleMap[params.row.role.role] || params.row.role.role;
        },
      },
    ],
    []
  );

  return (
    <div>
      <Datatable
        title="User Management"
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        onView={handleView}
      />

      <UserViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default UserList;
