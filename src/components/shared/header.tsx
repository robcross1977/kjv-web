import Auth from "../auth/auth";
import Title from "./title";

export default function Header() {
  return (
    <header className="flex flex-row w-full py-1 bg-sky-950 border-l-2 border-t-2 border-amber-100 border-b-black border-r-black border-r-1 border-b-1 rounded-t-lg justify-between items-center font-mono">
      <Title />
      <Auth />
    </header>
  );
}
