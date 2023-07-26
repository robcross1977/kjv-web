import Switcheroo from "@/components/shared/switcheroo";

type Props = {
  useEditMode: boolean;
  setUseEditMode: (enabled: boolean) => void;
};
export default function SideMenu({ useEditMode, setUseEditMode }: Props) {
  return (
    <div className="flex flex-col text-center items-center w-full bg-sky-800 text-zinc-50">
      <div className="w-full p-4 mb-4 font-semibold">
        <h2 className="text-2xl w-full underline">Options</h2>
      </div>
      <div className="flex mx-4">
        <Switcheroo
          enabled={useEditMode}
          setEnabled={setUseEditMode}
          labelText="Edit Mode"
        />
      </div>
    </div>
  );
}
