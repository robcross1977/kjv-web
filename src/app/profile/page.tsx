import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p>
            <strong>User ID:</strong> {session.user.id}
          </p>
          {session.user.name && (
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
          )}
          {session.user.email && (
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
