/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Organization } from "@/types";

// Validation schemas
const createOrganizationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  owner_id: z.string().uuid("Invalid user ID"),
});

const getOrganizationByIdSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
});

const getAllOrganizationsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

const updateOrganizationSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]).optional(),
});

// Create a new organization

export const createOrganizationAction = async (formData: FormData) => {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      owner_id: formData.get("owner_id") as string,
    };

    const validatedData = createOrganizationSchema.parse(rawData);

    const user = await db.user.findUnique({
      where: { id: validatedData.owner_id },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const organization = await db.organization.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        ownerId: validatedData.owner_id,
      },
    });

    const organizationId = organization.id;

    // Step 2: Create FirstStep, SecondStep, and ThirdStep concurrently
    await Promise.all([
      db.firstStep.create({
        data: {
          organizationId,
          data: {}, // Default empty JSON or prefill initial structure
        },
      }),
      db.secondStep.create({
        data: {
          organizationId,
          data: {}, // Default empty JSON or prefill initial structure
        },
      }),
      db.thirdStep.create({
        data: {
          organizationId,
          data: {}, // Default empty JSON or prefill initial structure
        },
      }),
      db.fourthStep.create({
        data: {
          organizationId,
          data: {},
        },
      }),
    ]);

    // Step 3: Revalidate cache
    revalidatePath("/organizations");

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    console.error("Error creating organization:", error);
    return {
      success: false,
      error: "Failed to create organization",
    };
  }
};

// Get all organizations for a user
export const getAllOrganizationsAction = async (userId: string) => {
  try {
    const validatedData = getAllOrganizationsSchema.parse({ userId });

    const organizations = await db.organization.findMany({
      where: { ownerId: validatedData.userId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: organizations as unknown as Organization[],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid user ID",
        details: error.errors,
      };
    }

    console.error("Error fetching organizations:", error);
    return {
      success: false,
      error: "Failed to fetch organizations",
    };
  }
};

// Get a specific organization by ID
export const getOrganizationByIdAction = async (organizationId: string) => {
  try {
    const validatedData = getOrganizationByIdSchema.parse({ organizationId });

    const organization = await db.organization.findUnique({
      where: { id: validatedData.organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid organization ID",
        details: error.errors,
      };
    }

    console.error("Error fetching organization:", error);
    return {
      success: false,
      error: "Failed to fetch organization",
    };
  }
};

// Update an organization
export const updateOrganizationAction = async (formData: FormData) => {
  try {
    const rawData = {
      organizationId: formData.get("organizationId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
    };

    const updateData: any = {};
    if (rawData.title) updateData.title = rawData.title;
    if (rawData.description !== undefined)
      updateData.description = rawData.description;
    if (rawData.status) updateData.status = rawData.status;

    const validatedData = updateOrganizationSchema.parse({
      organizationId: rawData.organizationId,
      ...updateData,
    });

    const existingOrganization = await db.organization.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!existingOrganization) {
      return { success: false, error: "Organization not found" };
    }

    const { organizationId, ...updateFields } = validatedData;

    const updatedOrganization = await db.organization.update({
      where: { id: organizationId },
      data: updateFields,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/organizations");
    revalidatePath(`/organizations/${organizationId}`);

    return {
      success: true,
      data: updatedOrganization,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    console.error("Error updating organization:", error);
    return {
      success: false,
      error: "Failed to update organization",
    };
  }
};

// Delete an organization
export const deleteOrganizationAction = async (organizationId: string) => {
  try {
    const validatedData = getOrganizationByIdSchema.parse({ organizationId });

    const existingOrganization = await db.organization.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!existingOrganization) {
      return { success: false, error: "Organization not found" };
    }

    await db.organization.delete({
      where: { id: validatedData.organizationId },
    });

    revalidatePath("/organizations");

    return {
      success: true,
      message: "Organization deleted successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid organization ID",
        details: error.errors,
      };
    }

    console.error("Error deleting organization:", error);
    return {
      success: false,
      error: "Failed to delete organization",
    };
  }
};
