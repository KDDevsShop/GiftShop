import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow bg-gray-50">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
