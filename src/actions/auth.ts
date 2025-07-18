"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import * as jose from "jose";

// Schema validation for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema validation for account creation
const createAccountSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Create a secret key for token signing and validation
const getSecretKey = async () => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return new TextEncoder().encode(secret);
};

// Login action
export const loginToYourAccountAction = async (formData: FormData) => {
  try {
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return {
        success: false,
        errors: { email: ["User not found"] },
      };
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        errors: { password: ["Invalid password"] },
      };
    }

    // Create JWT token using jose
    const secretKey = await getSecretKey();
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const awaitedCookies = await cookies();

    // Set HTTP-only cookie with token
    awaitedCookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
};

// Create account action
export const createAccountAction = async (formData: FormData) => {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const result = createAccountSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Check if user with email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        errors: { email: ["A user with this email already exists"] },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        id: uuidv4(),
        firstName: firstName,
        lastName: lastName,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token using jose
    const secretKey = await getSecretKey();
    const token = await new jose.SignJWT({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const awaitedCookies = await cookies();

    // Set HTTP-only cookie with token
    awaitedCookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
      },
    };
  } catch (error) {
    console.error("Account creation error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
};

// Logout action
export const logoutAction = async () => {
  try {
    const awaitedCookies = await cookies();
    // Clear the auth token cookie
    awaitedCookies.delete("auth-token");

    // Redirect to login page
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      errors: { _form: ["An error occurred during logout"] },
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const awaitedCookies = await cookies();
    const token = awaitedCookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    // Verify and decode the token using jose
    const secretKey = await getSecretKey();
    const { payload } = await jose.jwtVerify(token, secretKey);

    const user = await db.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        isActive: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Add this new function to the bottom of src/actions/auth.ts

// Schema for validating the profile update
const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export const updateUserAction = async (formData: FormData) => {
  "use server";

  try {
    // 1. Get the current logged-in user to ensure they are authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, errors: { _form: ["You must be logged in to update your profile."] } };
    }

    // 2. Extract and validate the form data
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    };

    const result = updateProfileSchema.safeParse(data);
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    // 3. Update the user in the database
    // We use the ID from the authenticated user session to ensure users can only update their own profile.
    await db.user.update({
      where: { id: currentUser.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        // We do NOT include the role, so it cannot be changed.
      },
    });

    return { success: true };

  } catch (error) {
    // Handle potential database errors, e.g., if the new email already exists
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return { success: false, errors: { email: ["This email address is already in use by another account."] } };
    }

    console.error("Update profile error:", error);
    return { success: false, errors: { _form: ["An unexpected error occurred."] } };
  }
};

// Add this new function to the bottom of src/actions/auth.ts

export const deleteAccountAction = async () => {
  "use server";

  try {
    // 1. Get the current user to ensure they are authenticated. This is a critical security step.
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      // This should technically never be reached if the button is on a protected page,
      // but it's a vital security check.
      throw new Error("You must be logged in to delete an account.");
    }

    // 2. Delete the user from the database using their authenticated ID.
    await db.user.delete({
      where: { id: currentUser.id },
    });

    // 3. Log the user out by deleting their session cookie.
    const awaitedCookies = await cookies();
    awaitedCookies.delete("auth-token");

    // 4. Redirect to the homepage or login page after successful deletion.
    redirect("/"); 

  } catch (error) {
    console.error("Delete account error:", error);
    // Return an error message if something goes wrong
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred while deleting your account."] },
    };
  }
};