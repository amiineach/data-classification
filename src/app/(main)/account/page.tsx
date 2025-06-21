// File: src/app/(main)/account/page.tsx

import { auth } from "@/auth"; // We import the 'auth' function from Auth.js
import { redirect } from 'next/navigation'; // To redirect users who are not logged in

// This page is now an 'async' function, allowing us to 'await' the session.
export default async function AccountPage() {
  
  // 1. Get the user's session securely on the server.
  const session = await auth();

  // 2. Protect the page. If there is no session, the user is not logged in.
  // Redirect them to the login page.
  if (!session?.user) {
    redirect('/login');
  }

  // 3. Extract the user object from the session.
  const user = session.user;
  
  // Note: The default user object from Auth.js has 'name' and 'email'.
  // We can derive first name, but last name might not be available
  // unless we customize the user schema later.
  const firstName = user.name?.split(' ')[0] || 'User';

  // 4. Display the user's information.
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name || 'Not Provided'}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{firstName}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {/* We will add logic for last name later if needed */}
            (Last Name not available yet)
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email || 'Not Provided'}</p>
        </div>
      </div>
    </div>
  );
}