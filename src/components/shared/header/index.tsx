"use client";

import Auth from "@components/auth";
import NavMenu from "./nav-menu";

function Title() {
  return (
    <div>
      <p className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 text-zinc-50 font-serif">
        Scripture Seeker
      </p>
    </div>
  );
}

export default function Header() {
  return (
    <header
      className={`
      flex flex-col justify-center
      w-full h-[105px]
      py-1
      bg-sky-950
      `}
    >
      <div className="flex lg:flex-col justify-between items-center lg:items-start w-11/12 lg:w-2/3 mx-auto">
        <div className="flex justify-between items-center w-full">
          <Title />
          <div className="hidden lg:block">
            <Auth />
          </div>
        </div>
        <div>
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
