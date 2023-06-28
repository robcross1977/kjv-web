import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Auth() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="mr-5 text-zinc-50 hover:text-teal-700">
      {user ? (
        <Link href="/api/auth/logout" data-testid="logout">
          {`Logout ${user.name}`}
        </Link>
      ) : (
        <Link href="/api/auth/login" data-testid="login">
          Login
        </Link>
      )}
    </div>
  );
}
