import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    imageFile: null,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullname, email, password, confirmPassword, phone, dateOfBirth } =
      formData;

    // Basic validations
    if (!fullname || !email || !password || !confirmPassword || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email address.");
      return;
    }

    if (!/^\d{9,11}$/.test(phone)) {
      setError("Phone number must be 9 to 11 digits.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    try {
      const response = await AuthService.signup(formData);
      toast.success("Registration successful!");

      console.log(response);

      localStorage.setItem("userId", response.userId);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden md:flex items-center justify-center bg-indigo-600 text-white p-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find Perfect Gifts</h1>
            <p className="text-lg">
              Discover personalized gift recommendations based on personality
              types.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="p-8 sm:p-10">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <Link
              to="/"
              className="mr-4 pb-2 text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="pb-2 text-blue-600 font-semibold border-b-2 border-blue-600"
            >
              Register
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">
            Join us to discover perfect gifts
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
