import { Combobox, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type InputModeOptions =
  | "none"
  | "text"
  | "decimal"
  | "numeric"
  | "tel"
  | "search"
  | "email"
  | "url";

export type KeyValueItem = {
  key: number;
  value: string;
};

type DisplayedValueProps = {
  selected: boolean;
  value: string;
};
function DisplayedValue({ selected, value }: DisplayedValueProps) {
  return (
    <span
      className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
    >
      {value}
    </span>
  );
}

type SelectedOptionProps = {
  active: boolean;
};
function SelectedOption({ active }: SelectedOptionProps) {
  return (
    <span
      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
        active ? "text-white" : "text-teal-600"
      }`}
    >
      <CheckIcon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

type ComboboxOptionsProps = {
  items: KeyValueItem[];
};
function ComboboxOptions({ items }: ComboboxOptionsProps) {
  return items.map((item) => (
    <Combobox.Option
      key={item.key}
      className={({ active }) =>
        `relative cursor-default select-none pl-3 md:pl-8 pr-4 ${
          active ? "bg-teal-600 text-white" : "text-gray-900"
        }`
      }
      value={item}
    >
      {({ selected, active }) => (
        <>
          <DisplayedValue selected={selected} value={String(item.value)} />
          {selected ? <SelectedOption active={active} /> : null}
        </>
      )}
    </Combobox.Option>
  ));
}

function NotFound() {
  return (
    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
      Nothing found.
    </div>
  );
}

type ComboboxTransitionProps = {
  query: string;
  setQuery: (query: string) => void;
  items: KeyValueItem[];
};
function ComboboxTransition({
  query,
  setQuery,
  items,
}: ComboboxTransitionProps) {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={() => setQuery("")}
    >
      <Combobox.Options
        className={`
        z-40
        absolute
        mt-1
        max-h-60
        w-full
        overflow-auto
        rounded-md
        bg-white
        py-1
        text-sm
        shadow-lg
        ring-1
        ring-black
        ring-opacity-5
        focus:outline-none
      `}
      >
        {items.length === 0 && query !== "" ? (
          <NotFound />
        ) : (
          <ComboboxOptions items={items} />
        )}
      </Combobox.Options>
    </Transition>
  );
}

function ComboboxButton() {
  return (
    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </Combobox.Button>
  );
}

type ComboboxInputProps<T> = {
  displayValue: (opt: T) => string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputMode: InputModeOptions;
};

function ComboboxInput<T>({
  displayValue,
  onChange,
  inputMode = "search",
}: ComboboxInputProps<T>) {
  return (
    <Combobox.Input
      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-slate-900 focus:ring-0"
      displayValue={displayValue}
      onChange={onChange}
      inputMode={inputMode}
    />
  );
}

type Props = {
  selectedValue: KeyValueItem;
  onChange: (value: any) => void;
  items: KeyValueItem[];
  query: string;
  setQuery(query: string): void;
  inputMode: InputModeOptions;
};
export default function ComboBox({
  selectedValue,
  onChange,
  setQuery,
  query,
  items,
  inputMode,
}: Props) {
  const getComboBoxInputDisplay = (item: KeyValueItem) => String(item.value);
  const getComboBoxInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  return (
    <Combobox value={selectedValue} onChange={onChange}>
      <div className="relative mt-1">
        <div
          className={`
          relative
          w-full
          cursor-default
          overflow-hidden
          rounded-lg
          bg-white
          text-left
          shadow-md
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-white
          focus-visible:ring-opacity-75
          focus-visible:ring-offset-2
          focus-visible:ring-offset-teal-300
          sm:text-sm
        `}
        >
          <ComboboxInput
            displayValue={getComboBoxInputDisplay}
            onChange={getComboBoxInputOnChange}
            inputMode={inputMode}
          />
          <ComboboxButton />
        </div>
        <ComboboxTransition items={items} query={query} setQuery={setQuery} />
      </div>
    </Combobox>
  );
}
