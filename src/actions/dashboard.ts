"use server";

import { db } from "@/lib/db"; // Adjust path as needed
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Types for better type safety
interface PolicyMonthData {
  month: string;
  policies: number;
}

interface OrganizationWithDetails {
  id: string;
  title: string;
  status: Status;
  createdAt: Date;
  owner: {
    firstName: string;
    lastName: string;
  };
}

interface DashboardStats {
  totalPolicies: number;
  activeOrganizations: number;
  pendingOrganizations: number;
  complianceRate: number;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total organizations count (representing policies in your context)
    const totalOrganizations = await db.organization.count();

    // Get active organizations count
    const activeOrganizations = await db.organization.count({
      where: {
        status: "ACTIVE",
      },
    });

    // Get pending organizations (you might need to add PENDING to your Status enum)
    // For now, using ARCHIVED as pending equivalent
    const pendingOrganizations = await db.organization.count({
      where: {
        status: "ARCHIVED",
      },
    });

    // Calculate compliance rate (example: organizations with all steps completed)
    const organizationsWithAllSteps = await db.organization.count({
      where: {
        AND: [
          { firstStep: { isNot: null } },
          { secondStep: { isNot: null } },
          { thirdStep: { isNot: null } },
          { fourthStep: { isNot: null } },
        ],
      },
    });

    const complianceRate =
      totalOrganizations > 0
        ? Math.round((organizationsWithAllSteps / totalOrganizations) * 100)
        : 0;

    return {
      totalPolicies: totalOrganizations,
      activeOrganizations,
      pendingOrganizations,
      complianceRate,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

// Get policy data by month (organizations created by month)
export async function getPolicyDataByMonth(): Promise<PolicyMonthData[]> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const organizations = await db.organization.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by month
    const monthlyData: { [key: string]: number } = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    organizations.forEach((org) => {
      const month = months[org.createdAt.getMonth()];
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    // Get last 6 months
    const result: PolicyMonthData[] = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = months[date.getMonth()];
      result.push({
        month: monthName,
        policies: monthlyData[monthName] || 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching policy data by month:", error);
    throw new Error("Failed to fetch monthly policy data");
  }
}

// Get recent organizations
export async function getRecentOrganizations(
  limit: number = 5
): Promise<OrganizationWithDetails[]> {
  try {
    const organizations = await db.organization.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return organizations;
  } catch (error) {
    console.error("Error fetching recent organizations:", error);
    throw new Error("Failed to fetch recent organizations");
  }
}

// Get all organizations with pagination
export async function getAllOrganizations(
  page: number = 1,
  limit: number = 10,
  status?: Status
) {
  try {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [organizations, total] = await Promise.all([
      db.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          firstStep: true,
          secondStep: true,
          thirdStep: true,
          fourthStep: true,
        },
      }),
      db.organization.count({ where }),
    ]);

    // Calculate step counts manually
    const organizationsWithCounts = organizations.map((org) => ({
      ...org,
      stepCounts: {
        firstStep: org.firstStep ? 1 : 0,
        secondStep: org.secondStep ? 1 : 0,
        thirdStep: org.thirdStep ? 1 : 0,
        fourthStep: org.fourthStep ? 1 : 0,
        total: [
          org.firstStep,
          org.secondStep,
          org.thirdStep,
          org.fourthStep,
        ].filter(Boolean).length,
      },
    }));

    return {
      organizations: organizationsWithCounts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Failed to fetch organizations");
  }
}

// Update organization status
export async function updateOrganizationStatus(
  organizationId: string,
  status: Status
) {
  try {
    const updatedOrganization = await db.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/dashboard");
    return updatedOrganization;
  } catch (error) {
    console.error("Error updating organization status:", error);
    throw new Error("Failed to update organization status");
  }
}

// Get organization details with all steps
export async function getOrganizationDetails(organizationId: string) {
  try {
    const organization = await db.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        owner: true,
        firstStep: true,
        secondStep: true,
        thirdStep: true,
        fourthStep: true,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  } catch (error) {
    console.error("Error fetching organization details:", error);
    throw new Error("Failed to fetch organization details");
  }
}

// Delete organization
export async function deleteOrganization(organizationId: string) {
  try {
    await db.organization.delete({
      where: {
        id: organizationId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw new Error("Failed to delete organization");
  }
}

// Get user's organizations
export async function getUserOrganizations(userId: string) {
  try {
    const organizations = await db.organization.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        firstStep: true,
        secondStep: true,
        thirdStep: true,
        fourthStep: true,
      },
    });

    // Calculate step counts manually
    const organizationsWithCounts = organizations.map((org) => ({
      ...org,
      stepCounts: {
        firstStep: org.firstStep ? 1 : 0,
        secondStep: org.secondStep ? 1 : 0,
        thirdStep: org.thirdStep ? 1 : 0,
        fourthStep: org.fourthStep ? 1 : 0,
        total: [
          org.firstStep,
          org.secondStep,
          org.thirdStep,
          org.fourthStep,
        ].filter(Boolean).length,
      },
    }));

    return organizationsWithCounts;
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    throw new Error("Failed to fetch user organizations");
  }
}

// Get organizations completion statistics
export async function getOrganizationCompletionStats() {
  try {
    const total = await db.organization.count();

    const withFirstStep = await db.organization.count({
      where: {
        firstStep: { isNot: null },
      },
    });

    const withSecondStep = await db.organization.count({
      where: {
        secondStep: { isNot: null },
      },
    });

    const withThirdStep = await db.organization.count({
      where: {
        thirdStep: { isNot: null },
      },
    });

    const withFourthStep = await db.organization.count({
      where: {
        fourthStep: { isNot: null },
      },
    });

    const fullyCompleted = await db.organization.count({
      where: {
        AND: [
          { firstStep: { isNot: null } },
          { secondStep: { isNot: null } },
          { thirdStep: { isNot: null } },
          { fourthStep: { isNot: null } },
        ],
      },
    });

    return {
      total,
      withFirstStep,
      withSecondStep,
      withThirdStep,
      withFourthStep,
      fullyCompleted,
      completionRate:
        total > 0 ? Math.round((fullyCompleted / total) * 100) : 0,
    };
  } catch (error) {
    console.error("Error fetching completion stats:", error);
    throw new Error("Failed to fetch completion statistics");
  }
}

// Search organizations
export async function searchOrganizations(query: string, limit: number = 10) {
  try {
    const organizations = await db.organization.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            owner: {
              OR: [
                {
                  firstName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        ],
      },
      take: limit,
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return organizations;
  } catch (error) {
    console.error("Error searching organizations:", error);
    throw new Error("Failed to search organizations");
  }
}

// Get dashboard data (combined function for efficiency)
export async function getDashboardData() {
  try {
    const [stats, policyData, recentOrgs] = await Promise.all([
      getDashboardStats(),
      getPolicyDataByMonth(),
      getRecentOrganizations(5),
    ]);

    return {
      stats,
      policyData,
      recentOrganizations: recentOrgs,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}
