"use client";

import Auth from "@components/auth";
import NavMenu from "./nav-menu";

function Title() {
  return (
    <div className="ml-3">
      <p className="font-semibold text-6xl mb-1 text-zinc-50 font-serif">
        Bible Buddy
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
      border-l-2 border-t-2 border-r-1 border-b-1
      border-amber-100 border-b-black border-r-black      
      rounded-lg
      `}
    >
      <div className="flex flex-row lg:flex-col justify-between lg:items-start">
        <div className="flex flex-row justify-between w-full">
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
