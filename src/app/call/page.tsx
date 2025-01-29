import { getCalls } from "./actions";
import Display from "./display";

export default async function CallPage() {
  const calls = await getCalls();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold w-full text-center bg-primary text-white dark:text-black px-4 py-2 rounded-lg">
        Call Management
      </h1>
      <div>
        <Display calls={calls} />
      </div>
    </div>
  );
}
