import { getPhone } from "./actions";
import Display from "./display";

export default async function PhonePage() {
  const phone = await getPhone();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Phone Management</h1>
      <div className="flex flex-col gap-2">
        <Display phone={phone} />
      </div>
    </div>
  );
}
