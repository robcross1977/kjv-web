import Auth from "@components/auth";
import Link from "next/link";
import { MarkAsReadToggle } from "./mark-as-read-toggle";

function Title() {
  return (
    <Link
      href="/"
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 font-serif">
        Bible Buddy
      </h1>
    </Link>
  );
}

export default function Header() {
  return (
    <header
      className={`
      flex flex-col justify-center
      w-full h-[105px]
      py-1
      `}
    >
      <div className="flex lg:flex-col justify-between items-center lg:items-start w-11/12 lg:w-2/3 mx-auto">
        <div className="flex justify-between items-center w-full">
          <Title />
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <MarkAsReadToggle />
            <Auth />
          </div>
        </div>
      </div>
    </header>
  );
}
