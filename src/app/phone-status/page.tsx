import { getPhoneStatus } from "./actions";
import Display from "./display";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { version?: string };
}) {
  const phoneStatus = await getPhoneStatus();
  const version = searchParams?.version || "0";

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Phone Status Management</h1>
      <div className="flex flex-col gap-2">
        <Display
          phoneStatus={phoneStatus}
          key={`${version}-${phoneStatus.length}`}
        />
      </div>
    </div>
  );
}
