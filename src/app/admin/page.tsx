import { getAdmins } from "./actions";
import Display from "./display";

export default async function AdminPage() {
  const admins = await getAdmins();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Admin Management</h1>
      <div className="flex flex-col gap-2">
        <Display admins={admins} />
      </div>
    </div>
  );
}
