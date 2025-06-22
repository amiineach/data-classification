// File: src/app/(main)/account/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { getCurrentUser, updateUserAction, logoutAction, deleteAccountAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define a type for our user state for better type safety
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

  // Fetch the current user's data when the component mounts
  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser as UserProfile);
      }
    }
    fetchUser();
  }, []);

  // Handle the form submission for updating the profile
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserAction(formData);
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Refresh user data to show the changes
        const updatedUser = await getCurrentUser();
        if (updatedUser) setUser(updatedUser as UserProfile);
      } else {
        const errorMessages = Object.values(result.errors || {}).flat().join('\n');
        alert(`Failed to update profile:\n${errorMessages}`);
      }
    });
  };

  // Show a loading state while fetching user data
  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  // Render the main page content
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      {/* Profile Editing Form */}
      <form action={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        
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
        
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.role}</p>
        </div>

        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
      {/* Danger Zone for Logout and Delete Account */}
      {/* The new framing div has been added here */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
        
        <h2 className="text-xl font-bold text-red-600 dark:text-red-500">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
          These actions are permanent and cannot be undone.
        </p>
        
        <Separator />

        {/* Logout Section */}
        <div className="flex items-center justify-between py-4">
          <p className="font-medium">Log out from your account.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await logoutAction();
              if (result.success) {
                alert("Logged out successfully!");
              } else {
                const errorMessages = Object.values(result.errors || {}).flat().join('\n');
                alert(`Failed to log out:\n${errorMessages}`);
              }
            }}
          >
            <Button type="submit" variant="secondary">Log Out</Button>
          </form>
        </div>

        <Separator />

        {/* Delete Account Section */}
        <div className="flex items-center justify-between py-4">
          <p className="font-medium">Delete your account and all associated data.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                return;
              }
              const result = await deleteAccountAction();
              if (result.success) {
                alert("Account deleted successfully!");
              } else {
                const errorMessages = Object.values(result.errors || {}).flat().join('\n');
                alert(`Failed to delete account:\n${errorMessages}`);
              }
            }}
          >
            <Button type="submit" variant="destructive">Delete Account</Button>
          </form>
        </div>
      </div>
    </div>
  );
}