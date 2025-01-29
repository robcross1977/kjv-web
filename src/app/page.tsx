import Header from "@/components/header";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <main className="w-full flex flex-col items-center mx-auto">
        <Link
          href="/admin"
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Admin Dashboard
        </Link>
      </main>
    </div>
  );
}
