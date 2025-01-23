"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef } from "react";

function SearchIcon() {
  return (
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
}

export default function FreeSearch() {
  const router = useRouter();
  const newQuery = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-grow lg:flex-auto w-full">
      <div className="text-sm">Search the Bible</div>
      <div className="relative lg:max-w-[512px]">
        <SearchIcon />

        <Input
          type="search"
          id="default-search"
          className="block w-full p-2 pl-10 text-sm rounded-lg"
          placeholder="Ex: Gen 1:2-3"
          required
          ref={newQuery}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              router.push(`/?query=${newQuery.current?.value}`);
            }
          }}
        />

        <Button
          type="submit"
          className="absolute right-2.5 bottom-0 font-small rounded-lg text-sm px-2"
          onClick={() => {
            router.push(`/?query=${newQuery.current?.value}`);
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
