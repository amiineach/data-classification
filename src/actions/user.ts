/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// User validation schema
const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
  isActive: z.boolean(),
  profileImage: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Get current user from JWT token
export const getCurrentUserAction = async () => {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        error: "No authentication token found",
        user: null,
      };
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret"
    );

    let payload: any;
    try {
      const { payload: jwtPayload } = await jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Invalid authentication token",
        user: null,
      };
    }

    // Extract user ID from JWT payload
    const userId = payload.id || payload.sub;

    if (!userId) {
      return {
        success: false,
        error: "User ID not found in token",
        user: null,
      };
    }

    // Fetch user from database
    const user = await db.user.findUnique({
      where: {
        id: userId,
        isActive: true, // Only return active users
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found or inactive",
        user: null,
      };
    }

    // Validate user data
    const validatedUser = userSchema.parse(user);

    return {
      success: true,
      user: validatedUser,
      error: null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return {
      success: false,
      error: "Failed to get user information",
      user: null,
    };
  }
};

// Check if user is admin
export const checkUserPermissionAction = async (requiredRole?: "ADMIN") => {
  try {
    const result = await getCurrentUserAction();

    if (!result.success || !result.user) {
      return {
        success: false,
        error: result.error,
        hasPermission: false,
      };
    }

    const hasPermission = requiredRole
      ? result.user.role === requiredRole
      : true;

    return {
      success: true,
      hasPermission,
      user: result.user,
      error: null,
    };
  } catch (error) {
    console.error("Error checking user permission:", error);
    return {
      success: false,
      error: "Failed to check user permission",
      hasPermission: false,
    };
  }
};

// Logout action - clear auth cookie
export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();

    // Clear the auth token cookie
    cookieStore.delete("auth-token");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Error during logout:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
};
