import Header from "@components/shared/header";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Profile() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
            <p>Please log in to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            {user.picture && (
              <Image
                src={user.picture}
                alt={user.name ?? "Profile Picture"}
                width={100}
                height={100}
                className="rounded-full mx-auto mb-4"
              />
            )}
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {user.email}
            </p>
            <div className="text-left">
              <h2 className="text-lg font-semibold mb-2">User Information</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
