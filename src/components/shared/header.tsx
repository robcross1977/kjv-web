import Auth from "../auth/auth";
import Title from "./title";

export default function Header() {
  return (
    <header className="flex flex-col w-full sm:flex-row py-1 bg-yellow-500 rounded-t-lg justify-between items-center">
      <Title />
      <Auth />
    </header>
  );
}
