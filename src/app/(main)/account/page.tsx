// File: src/app/(main)/account/page.tsx
"use client"; // This page is now interactive, so we need "use client"

import { useState, useEffect, useTransition } from 'react';
// We now need to import BOTH actions
import { getCurrentUser, updateUserAction } from "@/actions/auth";

// Define a type for our user state to avoid errors
type UserProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // --- Data Fetching ---
  // We use useEffect to fetch the user data on the client side
  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser as UserProfile);
      }
    }
    fetchUser();
  }, []);

  // --- Form Submission Handler ---
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserAction(formData);
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Refresh the user data after a successful update
        const updatedUser = await getCurrentUser();
        if (updatedUser) setUser(updatedUser as UserProfile);
      } else {
        // You can add more sophisticated error handling here
        const errorMessages = Object.values(result.errors || {}).flat().join('\n');
        alert(`Failed to update profile:\n${errorMessages}`);
      }
    });
  };

  // --- Render Logic ---
  if (!user) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <form action={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        
        {/* First Name Field */}
        <div className="mb-4">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={user.firstName || ''}
            readOnly={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-semibold text-gray-900 dark:text-white read-only:bg-gray-100 read-only:dark:bg-gray-800 read-only:border-transparent"
          />
        </div>

        {/* Last Name Field */}
        <div className="mb-4">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={user.lastName || ''}
            readOnly={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-semibold text-gray-900 dark:text-white read-only:bg-gray-100 read-only:dark:bg-gray-800 read-only:border-transparent"
          />
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            readOnly={!isEditing}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-semibold text-gray-900 dark:text-white read-only:bg-gray-100 read-only:dark:bg-gray-800 read-only:border-transparent"
          />
        </div>
        
        {/* Role Field (Always read-only) */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.role}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400">
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}