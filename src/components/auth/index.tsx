import Link from "next/link";
import Image from "next/image";
import { auth } from "../../../auth";

export default async function Auth() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="lg:mr-5 items-center justify-center">
      {user ? (
        <div className="flex flex-row items-center justify-center gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/signout" data-testid="logout" className="lg:pr-3">
            Logout
          </a>
          {user.image && (
            <Link href="/profile">
              <Image
                src={user.image}
                alt={user.name ?? "Profile Picture"}
                width={30}
                height={30}
                className="rounded-full"
              />
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/signin" data-testid="login">
            Login
          </a>
        </>
      )}
    </div>
  );
}
