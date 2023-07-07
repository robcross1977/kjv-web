"use client";

import Auth from "../auth/auth";
import NavMenu from "./nav-menu";
import Title from "./title";

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
