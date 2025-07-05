import Link from "next/link";
import Image from "next/image";
import { auth } from "../../../auth";

export default async function Auth() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex items-center justify-center">
      {user ? (
        <div className="flex flex-row items-center justify-center gap-1 sm:gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signout"
            data-testid="logout"
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Logout
          </a>
          {user.image && (
            <Link href="/profile">
              <Image
                src={user.image}
                alt={user.name ?? "Profile Picture"}
                width={24}
                height={24}
                className="rounded-full sm:w-[30px] sm:h-[30px]"
              />
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/auth/signin"
            data-testid="login"
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Login
          </a>
        </>
      )}
    </div>
  );
}
