"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "@/actions/auth";
import { Button } from "./ui/button";

// Define the user type based on your getCurrentUser function
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Assuming role could be any string
  isActive: boolean;
  bio: string | null;
};

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();

  // Use React Query's useMutation for the logout functionality
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await logoutAction();
      if (!result.success) {
        throw new Error("Failed to logout");
      }
      return result;
    },
    onSuccess: () => {
      // Redirect to login page after successful logout
      router.push("/login");
      router.refresh(); // Refresh the page to update server components
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Handle error (could add toast notification here)
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile Image/Initials */}

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600 mb-4">{user.email}</p>

          {user.bio ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{user.bio}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-500 italic">No bio provided</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              variant={"destructive"}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>

          {/* Show loading or error states */}
          {logoutMutation.isError && (
            <p className="mt-2 text-red-600">
              Error logging out: {logoutMutation.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
