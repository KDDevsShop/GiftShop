import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">GiftWise</h4>
          <p className="text-sm">
            A smart gift suggestion and management platform for every special
            occasion.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:underline">
                Profile
              </a>
            </li>
            <li>
              <a href="/gifts" className="hover:underline">
                Gift Suggestions
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact</h4>
          <p className="text-sm">support@giftwise.com</p>
          <p className="text-sm">+1 (123) 456-7890</p>
        </div>
      </div>
      <div className="border-t text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} GiftWise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
