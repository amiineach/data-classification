// File: src/app/(main)/account/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { getCurrentUser, updateUserAction } from "@/actions/auth";

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

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser as UserProfile);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserAction(formData);
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        const updatedUser = await getCurrentUser();
        if (updatedUser) setUser(updatedUser as UserProfile);
      } else {
        const errorMessages = Object.values(result.errors || {}).flat().join('\n');
        alert(`Failed to update profile:\n${errorMessages}`);
      }
    });
  };

  if (!user) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Account</h1>
      
      <form 
        action={handleSubmit} 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name Field */}
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={user.firstName || ''}
              readOnly={!isEditing}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label 
              htmlFor="lastName" 
              className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={user.lastName || ''}
              readOnly={!isEditing}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div className="mb-6">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            readOnly={!isEditing}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-base text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        {/* Role Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Role
          </label>
          <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-base font-medium text-gray-900 dark:text-white">{user.role}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-lg text-indigo-700 dark:text-indigo-200 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:bg-indigo-400 transition-colors"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
