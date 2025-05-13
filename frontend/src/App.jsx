import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import "./App.css";
import Register from "./pages/authentication/Register";
import { ToastContainer } from "react-toastify";
import ProductTypeList from "./pages/admin/ProductTypeList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product-type" element={<ProductTypeList />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000} // Áp dụng thời gian autoClose cho tất cả các thông báo
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </Router>
  );
}

export default App;
