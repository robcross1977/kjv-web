import Auth from "@components/auth";
import Link from "next/link";
import UnifiedSearch from "@/components/search/unified-search";
import { MarkAsReadToggle } from "./mark-as-read-toggle";
import { ToolsButton } from "./tools-button";

function Title() {
  return (
    <Link href="/" className="group cursor-pointer">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-red-600 to-primary bg-clip-text text-transparent hover:from-red-700 hover:via-primary hover:to-red-700 transition-all duration-500 transform hover:scale-105 font-serif leading-tight py-2">
        Verse Vibe
      </h1>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-header/80 border-b border-header/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-header/90 via-header/95 to-header/90"></div>

      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-3 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-primary rounded-full animate-ping"></div>
        <div className="absolute bottom-3 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-5 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping delay-500"></div>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex flex-col justify-center items-center lg:items-start w-full space-y-4">
          {/* Title and Auth Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <Title />
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
              <ToolsButton />
              <MarkAsReadToggle />
              <Auth />
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-2xl">
              <UnifiedSearch />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
