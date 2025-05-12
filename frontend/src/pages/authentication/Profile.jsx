import React, { useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout";

const Profile = () => {
  // Fake user data
  const user = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
  };

  const [activeTab, setActiveTab] = useState("info");

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row gap-2 border-b border-gray-200 mb-6">
            {[
              { key: "info", label: "Personal Info" },
              { key: "preferences", label: "Preferences" },
              { key: "history", label: "Gift History" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition ${
                  activeTab === key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === "info" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Personal Information
                </h2>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Preferences & Interests
                </h2>
                <p className="text-gray-600 mb-6">
                  Tell us more about your interests so we can suggest better
                  gift ideas for you.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Favorite Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Categories
                    </label>
                    <div className="space-y-2">
                      {[
                        "Technology",
                        "Fashion",
                        "Home Appliances",
                        "Books & Stationery",
                      ].map((item, idx) => (
                        <div className="flex items-center gap-2" key={idx}>
                          <input type="checkbox" id={`cat-${idx}`} />
                          <label
                            htmlFor={`cat-${idx}`}
                            className="text-sm text-gray-700"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hobbies
                    </label>
                    <div className="space-y-2">
                      {["Reading", "Traveling", "Cooking", "Sports"].map(
                        (item, idx) => (
                          <div className="flex items-center gap-2" key={idx}>
                            <input type="checkbox" id={`int-${idx}`} />
                            <label
                              htmlFor={`int-${idx}`}
                              className="text-sm text-gray-700"
                            >
                              {item}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-medium">
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Gift History
                </h2>
                <div className="p-6 text-center bg-gray-50 rounded-md text-gray-500">
                  You don’t have any gift history yet.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Profile;
