// File: src/app/(main)/account/page.tsx

// 1. Import YOUR own `getCurrentUser` function from the correct file.
import { getCurrentUser } from "@/actions/auth";
import { redirect } from 'next/navigation';

// This is an async Server Component, which is perfect.
export default async function AccountPage() {
  
  // 2. Call YOUR `getCurrentUser` function to get the logged-in user's details.
  const user = await getCurrentUser();

  // 3. Protect the page. If no user is returned, redirect to the login page.
  if (!user) {
    redirect('/login');
  }
  
  // 4. Display the user's information using the fields from your database.
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.firstName || 'Not Provided'}
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.lastName || 'Not Provided'}
          </p>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.email}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}