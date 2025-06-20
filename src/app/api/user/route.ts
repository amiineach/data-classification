import { NextResponse } from "next/server";

export async function GET() {
  // Simulated user data (replace this with actual database or authentication logic)
  const user = {
    firstName: "Amine",
    lastName: "Ach",
    email: "amine.ach@example.com",
    profileImage: "https://via.placeholder.com/100",
    bio: "Administrator of the data classification platform.",
  };

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Simulate updating user data (replace with actual database logic)
  const updatedUser = {
    ...body,
  };

  return NextResponse.json(updatedUser);
}

export async function DELETE() {
  // Simulate account deletion (replace with actual database logic)
  return NextResponse.json({ message: "Account deleted successfully" });
}