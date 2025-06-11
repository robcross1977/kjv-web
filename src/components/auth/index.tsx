import Link from "next/link";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Auth() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="lg:mr-5 items-center justify-center">
      {user ? (
        <div className="flex flex-row items-center justify-center gap-2">
          <a href="/auth/logout" data-testid="logout" className="lg:pr-3">
            Logout
          </a>
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
        <a href="/auth/login" data-testid="login">
          Login
        </a>
      )}
    </div>
  );
}
