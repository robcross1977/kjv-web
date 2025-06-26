import Auth from "@components/auth";
import Link from "next/link";
import HeaderMastraSearch from "@/components/search/mastra-search/header-search";

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
    <header className="bg-header py-3 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center lg:items-start w-full space-y-4">
          {/* Title and Auth Row */}
          <div className="flex justify-between items-center w-full">
            <Title />
            <div className="flex items-center gap-3">
              <Auth />
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="w-full flex justify-center lg:justify-start">
            <HeaderMastraSearch />
          </div>
        </div>
      </div>
    </header>
  );
}
