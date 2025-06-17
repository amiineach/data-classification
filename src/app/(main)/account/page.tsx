"use client";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
};

export default function ProfilePage() {
  // Replace this mock with your real data fetching logic
  const user: User = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImage: "https://via.placeholder.com/100",
    bio: "Passionate full-stack developer based in Algiers.",
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          className="bg-[#792a9f] text-white px-4 py-2 rounded-md hover:bg-[#792a9f] transition"
          onClick={() => {
            // You can replace this with navigation or modal logic
            alert("Edit profile clicked");
          }}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex items-center space-x-6 bg-white shadow p-6 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-700">
            {user.bio || "No bio available."}
          </p>
        </div>
      </div>
    </div>
  );
}
