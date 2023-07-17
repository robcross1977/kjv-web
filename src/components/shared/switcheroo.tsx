import { useState } from "react";
import { Switch } from "@headlessui/react";

type Props = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  labelText: string;
};
export default function Switcheroo({ enabled, setEnabled, labelText }: Props) {
  return (
    <div>
      <Switch.Group>
        <Switch.Label className="mr-4 text-sm">{labelText}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? "bg-sky-950" : "bg-sky-800"}
          relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${enabled ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </Switch.Group>
    </div>
  );
}
