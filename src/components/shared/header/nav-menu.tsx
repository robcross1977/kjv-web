import Link from "next/link";
import { useState } from "react";

export default function NavMenu() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div>
      <nav>
        {/* MOBILE MENU */}
        <section className="flex md:hidden justify-end mb-2">
          {/* HAMBURGER ICON */}
          <div
            className="space-y-1 mr-5"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-5 animate-pulse bg-zinc-50"></span>
            <span className="block h-0.5 w-5 animate-pulse bg-zinc-50"></span>
            <span className="block h-0.5 w-5 animate-pulse bg-zinc-50"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              {/* X ICON */}
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link href="/">Home</Link>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link href="/discipleship">Discipleship</Link>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </section>

        {/* DESKTOP MENU */}
        <ul className="hidden space-x-3 md:flex ml-3 text-sm text-zinc-50">
          <li>
            <Link href="/" className="hover:text-teal-700">
              Home
            </Link>
          </li>
          <li>
            <Link href="/discipleship" className="hover:text-teal-700">
              Discipleship
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-teal-700">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
      `}</style>
    </div>
  );
}
