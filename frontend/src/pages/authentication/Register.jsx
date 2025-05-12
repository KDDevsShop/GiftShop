import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
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

          {/* Error Placeholder */}
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded hidden">
            Error message goes here
          </div>

          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
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
