import Switcheroo from "../shared/switcheroo";

type Props = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
};

export default function SearchType({ enabled, setEnabled }: Props) {
  return (
    <div className="w-full flex-row justify-start items-center gap-2 hidden lg:flex">
      <div>Use Free-Form Search?</div>
      <div>
        <Switcheroo enabled={enabled} setEnabled={setEnabled} />
      </div>
    </div>
  );
}
