"use client";

import FreeSearch from "@/components/free-search";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="font-serif font-semibold text-6xl text-yellow-600 text-center mt-8">
          Bible Buddy
        </h1>
      </div>
      <FreeSearch />
    </>
  );
}
