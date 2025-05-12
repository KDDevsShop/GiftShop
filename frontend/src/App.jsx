import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import "./App.css";
import Register from "./pages/authentication/Register";
import Profile from "./pages/authentication/Profile";
import NotFound from "./pages/authentication/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
