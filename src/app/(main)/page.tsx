"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  ActivitySquare,
  Users,
  FileText,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  getDashboardData,
  updateOrganizationStatus,
  deleteOrganization,
} from "@/actions/dashboard";

// Types
interface DashboardData {
  stats: {
    totalPolicies: number;
    activeOrganizations: number;
    pendingOrganizations: number;
    complianceRate: number;
  };
  policyData: Array<{
    month: string;
    policies: number;
  }>;
  recentOrganizations: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    owner: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  // React Query for dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation for updating organization status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      orgId,
      status,
    }: {
      orgId: string;
      status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
    }) => updateOrganizationStatus(orgId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
      // You could add a toast notification here
    },
  });

  // Mutation for deleting organization
  const deleteMutation = useMutation({
    mutationFn: (orgId: string) => deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      console.error("Failed to delete organization:", error);
      // You could add a toast notification here
    },
  });

  // Handle organization status update
  const handleStatusUpdate = (
    orgId: string,
    newStatus: "ACTIVE" | "ARCHIVED" | "COMPLETED"
  ) => {
    updateStatusMutation.mutate({ orgId, status: newStatus });
  };

  // Handle organization deletion
  const handleDelete = (orgId: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteMutation.mutate(orgId);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "ARCHIVED":
        return "bg-amber-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load dashboard"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { stats, policyData, recentOrganizations } = dashboardData;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome to your dashboard
            </h2>
            <p className="text-gray-500 mt-1">
              Here&apos;s what&apos;s happening with your policies today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Today: {formatDate(new Date())}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Policies
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalPolicies}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-md">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Organizations
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.activeOrganizations}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-md">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Organizations
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.pendingOrganizations}
                </h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-md">
                <ActivitySquare className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Compliance Rate
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.complianceRate}%
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-md">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-96">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Generated Policies
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={policyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="policies" fill="#792a9f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Organizations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-96">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Recent Organizations
              </h3>
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                View All
              </button>
            </div>
            <div className="overflow-y-auto max-h-[300px] pr-2">
              {recentOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{org.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Owner: {org.owner.firstName} {org.owner.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${getStatusColor(
                            org.status
                          )}`}
                        />
                        <span className="text-xs text-gray-500">
                          {org.status} • Added {formatDate(org.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <select
                        value={org.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            org.id,
                            e.target.value as
                              | "ACTIVE"
                              | "ARCHIVED"
                              | "COMPLETED"
                          )
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        disabled={updateStatusMutation.isPending}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="ARCHIVED">Archived</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-red-400 hover:text-red-600 ml-2 disabled:opacity-50"
                        title="Delete organization"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recentOrganizations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No organizations found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
