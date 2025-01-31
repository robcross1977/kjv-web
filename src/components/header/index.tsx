"use client";

import Auth from "@/components/auth";

function Title() {
  return (
    <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 font-serif text-gray-900 dark:text-white">
      Ami's Meal Planner
    </h1>
  );
}

export default function Header() {
  return (
    <header
      className={`
      flex flex-col justify-center
      w-full h-[105px]
      py-1
      bg-white shadow-sm shadow-gray-200 dark:bg-gray-900 dark:shadow-gray-800
      z-10 relative
      `}
    >
      <div className="flex lg:flex-col justify-between items-center lg:items-start w-full px-4">
        <div className="flex justify-between items-center w-full max-w-[1800px] mx-auto">
          <Title />
          <div className="hidden lg:block">
            <Auth />
          </div>
        </div>
      </div>
    </header>
  );
}
