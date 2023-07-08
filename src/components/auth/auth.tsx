import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Auth() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="text-zinc-50 mr-5">Loading...</div>;
  }

  return (
    <div className="mr-5 text-zinc-50 items-center justify-center">
      {user ? (
        <div className="flex flex-row items-center justify-center">
          <Link
            href="/api/auth/logout"
            data-testid="logout"
            className="pr-3 hover:text-teal-700"
          >
            Logout
          </Link>
          {user.picture && (
            <Link href="/profile">
              <Image
                src={user.picture}
                alt={user.name ?? "Profile Picture"}
                width={30}
                height={30}
                className="rounded-full"
              />
            </Link>
          )}
        </div>
      ) : (
        <Link href="/api/auth/login" data-testid="login">
          Login
        </Link>
      )}
    </div>
  );
}
