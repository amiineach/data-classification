"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { getAllOrganizationsAction } from "@/actions/project"; // You may also rename the file for consistency
import { Loader2, RefreshCw } from "lucide-react";
import CreateOrganization from "@/components/modals/create-organization";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface PageViewOrganizationsProps {
  userId: string;
}

export default function PageViewOrganizations({
  userId,
}: PageViewOrganizationsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: organizationsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizations", userId],
    queryFn: async () => {
      const result = await getAllOrganizationsAction(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch organizations");
      }

      return result.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();

      console.log(organizationsResponse);
      toast.success("Organizations refreshed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh organizations");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col p-8">
        <div className="w-full h-[100px] flex items-center justify-between">
          <h2 className="font-bold text-2xl">Organizations</h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading organizations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex flex-col p-8">
        <div className="w-full h-[100px] flex items-center justify-between">
          <h2 className="font-bold text-2xl">Organizations</h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <div className="text-red-500">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0l-5.898 12.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">
              Failed to load organizations
            </h3>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const organizations = organizationsResponse || [];

  return (
    <div className="w-full min-h-screen flex flex-col p-8">
      <div className="w-full h-[100px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-2xl">Organizations</h2>
          <span className="text-sm text-muted-foreground">
            ({organizations.length}{" "}
            {organizations.length === 1 ? "organization" : "organizations"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <CreateOrganization userId={userId} />
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <div className="text-muted-foreground">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">No organizations yet</h3>
            <p className="text-muted-foreground">
              Get started by creating your first organization to manage your
              teams and resources.
            </p>
            <CreateOrganization
              userId={userId}
              triggerText="Create your first organization"
            />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={organizations ?? []} />
      )}
    </div>
  );
}
