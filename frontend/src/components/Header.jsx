import React from "react";

const Header = () => {
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo / Title */}
      <div className="text-xl font-bold text-indigo-600">🎁 GiftApp</div>

      {/* Navigation - Add more links if needed */}
      <nav className="hidden md:flex space-x-6 text-sm text-gray-600">
        <a href="#" className="hover:text-indigo-600">
          Home
        </a>
        <a href="#" className="hover:text-indigo-600">
          Gifts
        </a>
        <a href="#" className="hover:text-indigo-600">
          Contact
        </a>
      </nav>

      {/* User avatar */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
        {user.name.charAt(0).toUpperCase()}
      </div>
    </header>
  );
};

export default Header;
