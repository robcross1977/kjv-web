"use client";

import FreeSearch from "@/components/search/free-search";
import Header from "@/components/shared/header";

export default function Home() {
  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      <Header />
      <FreeSearch />
    </div>
  );
}
