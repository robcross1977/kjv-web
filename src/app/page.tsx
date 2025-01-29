import Link from "next/link";

export default async function Home() {
  return (
    <main className="w-full flex flex-col items-center mx-auto">
      <Link href="/admin" className="mt-8 px-4 py-2">
        Admin Dashboard
      </Link>
      <Link href="/phone-status" className="mt-8 px-4 py-2">
        Phone Status Dashboard
      </Link>
    </main>
  );
}
