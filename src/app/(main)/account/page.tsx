"use client";

import { useEffect, useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State for modal visibility
  const [formData, setFormData] = useState<User | null>(null); // State for form data

  // Fetch user data from the API
  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch("/api/user");
      const data: User = await response.json();
      setUser(data);
      setFormData(data); // Initialize form data
    }

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSaveChanges = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false); // Close the modal
    } else {
      alert("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const response = await fetch("/api/user", { method: "DELETE" });

    if (response.ok) {
      alert("Account deleted successfully");
      setUser(null); // Clear user data
    } else {
      alert("Failed to delete account");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          onClick={() => setIsEditing(true)} // Open the modal
        >
          Edit Profile
        </button>
      </div>

      <div className="flex items-center space-x-6 bg-white shadow-md p-6 rounded-lg">
        <div className="flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-300">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-700">
            {user.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Modal for editing profile */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Profile</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="password"
                name="password"
                onChange={handleInputChange}
                placeholder="New Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}