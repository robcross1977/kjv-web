import Link from "next/link";
import { Button } from "@/components/ui/button";
export default async function Home() {
  return (
    <main className="w-full flex flex-col items-center mx-auto">
      <Link href="/admin" className="mt-8 px-4 py-2">
        <Button>Admin Dashboard</Button>
      </Link>
      <Link href="/phone-status" className="mt-8 px-4 py-2">
        <Button>Phone Status Dashboard</Button>
      </Link>
      <Link href="/phone" className="mt-8 px-4 py-2">
        <Button>Phone Dashboard</Button>
      </Link>
    </main>
  );
}
