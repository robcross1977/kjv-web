import { getAdmins } from "./actions";
import Display from "./display";
import { revalidatePath } from "next/cache";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { version?: string };
}) {
  const admins = await getAdmins();
  const version = searchParams?.version || "0";

  const refreshData = async () => {
    "use server";
    // Revalidate the page data
    revalidatePath("/admin");

    // Alternatively: Revalidate using a specific tag if using fetch cache
    // revalidateTag("admins");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Admin Management</h1>
      <div className="flex flex-col gap-2">
        <Display
          admins={admins}
          key={`${version}-${admins.length}`}
          refreshData={refreshData}
          version={version}
        />
      </div>
    </div>
  );
}
