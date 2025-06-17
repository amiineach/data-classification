"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, CheckCircle, Clock, Building } from "lucide-react";

interface AnalyticsData {
  userAnalytics: {
    totalOrganizations: number;
    completedSteps: number;
    totalPossibleSteps: number;
    completionRate: number;
    statusBreakdown: Record<string, number>;
    recentOrganizations: Array<{
      id: string;
      title: string;
      status: string;
      createdAt: Date;
      stepsCompleted: number;
    }>;
  };
  organizationProgress: Array<{
    date: string;
    count: number;
  }>;
  stepCompletionStats: {
    steps: Array<{
      name: string;
      completed: number;
      percentage: number;
    }>;
    totalOrganizations: number;
  };
  monthlyTrend: Array<{
    month: string;
    count: number;
    monthName: string;
  }>;
  completionDetails: {
    organizations: Array<{
      id: string;
      title: string;
      status: string;
      stepsCompleted: number;
      completionPercentage: number;
      createdAt: Date;
      updatedAt: Date;
      isComplete: boolean;
    }>;
    summary: {
      fullyCompleted: number;
      partiallyCompleted: number;
      notStarted: number;
      total: number;
    };
  };
}

interface Props {
  data: AnalyticsData;
}

// Color schemes for charts
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsDashboard({ data }: Props) {
  // Summary cards data
  const summaryCards = [
    {
      title: "Total Organizations",
      value: data.userAnalytics.totalOrganizations,
      icon: <Building className="w-6 h-6" />,
      color: "bg-blue-500",
      description: "Organizations created",
    },
    {
      title: "Completion Rate",
      value: `${data.userAnalytics.completionRate}%`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
      description: "Overall progress",
    },
    {
      title: "Completed Steps",
      value: data.userAnalytics.completedSteps,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-purple-500",
      description: `of ${data.userAnalytics.totalPossibleSteps} total`,
    },
    {
      title: "Active Organizations",
      value: data.userAnalytics.statusBreakdown.ACTIVE || 0,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-orange-500",
      description: "Currently in progress",
    },
  ];

  // Prepare pie chart data for status breakdown
  const statusPieData = Object.entries(data.userAnalytics.statusBreakdown).map(
    ([status, count]) => ({
      name: status.charAt(0) + status.slice(1).toLowerCase(),
      value: count,
      percentage: Math.round(
        (count / data.userAnalytics.totalOrganizations) * 100
      ),
    })
  );

  // Prepare completion summary pie data
  const completionSummaryData = [
    {
      name: "Fully Completed",
      value: data.completionDetails.summary.fullyCompleted,
      color: "#10B981",
    },
    {
      name: "Partially Completed",
      value: data.completionDetails.summary.partiallyCompleted,
      color: "#F59E0B",
    },
    {
      name: "Not Started",
      value: data.completionDetails.summary.notStarted,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full text-white`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step Completion Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Step Completion Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.stepCompletionStats.steps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "completed" ? `${value} organizations` : `${value}%`,
                  name === "completed" ? "Completed" : "Percentage",
                ]}
              />
              <Legend />
              <Bar
                dataKey="completed"
                fill="#3B82F6"
                name="Completed Organizations"
              />
              <Bar dataKey="percentage" fill="#10B981" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Organization Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Organization Creation Trend
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} organizations`, "Created"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              fill="#3B82F680"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Progress (Last 30 Days) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Activity (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.organizationProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value} organizations`, "Created"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Completion Summary
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionSummaryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {completionSummaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Organizations Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Organizations
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.userAnalytics.recentOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {org.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        org.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : org.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {org.status.charAt(0) + org.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(org.stepsCompleted / 4) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {org.stepsCompleted}/4
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Completion List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Organizations - Detailed View
        </h3>
        <div className="grid gap-4">
          {data.completionDetails.organizations.slice(0, 10).map((org) => (
            <div
              key={org.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{org.title}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        org.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : org.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {org.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      Updated: {new Date(org.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {org.completionPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {org.stepsCompleted}/4 steps
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${org.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.completionDetails.organizations.length > 10 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Showing 10 of {data.completionDetails.organizations.length}{" "}
              organizations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
