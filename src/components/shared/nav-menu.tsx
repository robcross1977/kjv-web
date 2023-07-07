import Link from "next/link";
import { useRef } from "react";

export default function NavMenu() {
  const mobileMenuRef = useRef<null | HTMLDivElement>(null);

  return (
    <div className="text-zinc-50">
      <div className="flex w-full items-center px-2">
        {/* Show menu on large screens */}
        <div className="hidden w-full flex-row text-sm font-extralight md:flex">
          <div className="flex divide-x-2 divide-sky-900 gap-x-1">
            <Link className="hover:text-teal-700" href={"/"}>
              Home
            </Link>
            <Link className="hover:text-teal-700 pl-2" href={"/discipleship"}>
              Discipleship
            </Link>
          </div>
        </div>

        {/* Show hamburger on small screens */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => mobileMenuRef.current?.classList.toggle("hidden")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="flex-col justify-center items-start gap-2 hidden md:hidden"
      >
        <div>
          <Link className="" href={"/"}>
            Home
          </Link>
        </div>
        <div>
          <Link className="" href={"/discipleship"}>
            Discipleship
          </Link>
        </div>
      </div>
    </div>
  );
}
