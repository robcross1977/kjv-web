import Switcheroo from "../shared/switcheroo";

type Props = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
};

export default function SearchType({ enabled, setEnabled }: Props) {
  return (
    <Switcheroo
      enabled={enabled}
      setEnabled={setEnabled}
      labelText="Advanced Search"
    ></Switcheroo>
  );
}
