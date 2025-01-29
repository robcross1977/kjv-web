import { getUsers } from "./actions";
import Display from "./display";

export default async function UserPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold w-full text-center bg-primary text-white dark:text-black px-4 py-2 rounded-lg">
        User Management
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <Display users={users} />
      </div>
    </div>
  );
}
