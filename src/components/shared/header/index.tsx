"use client";

import Auth from "@components/auth";
import NavMenu from "./nav-menu";

function Title() {
  return (
    <div className="ml-3">
      <p className="font-semibold text-4xl mb-1 text-zinc-50 font-serif">
        Bible Buddy
      </p>
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex flex-col w-full py-1 bg-sky-950 border-l-2 border-t-2 border-amber-100 border-b-black border-r-black border-r-1 border-b-1 rounded-lg">
      <div className="flex flex-row justify-between items-center">
        <Title />
        <Auth />
      </div>
      <div>
        <NavMenu />
      </div>
    </header>
  );
}
