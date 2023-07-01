"use client";

import Search from "@/components/search";
import Header from "@/components/shared/header";

export default function Home() {
  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      <Header />
      <Search />
    </div>
  );
}
