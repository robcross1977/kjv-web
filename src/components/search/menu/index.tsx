import { Menu, Transition } from "@headlessui/react";
import { Fragment, JSX, SVGProps } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import SearchType from "../search-type";
import Switcheroo from "@/components/shared/switcheroo";

type Props = {
  freeFormSearchEnabled: boolean;
  setFreeFormSearchEnabled: (enabled: boolean) => void;
  useEditMode: boolean;
  setUseEditMode: (enabled: boolean) => void;
};
export default function SearchMenu({
  freeFormSearchEnabled,
  setFreeFormSearchEnabled,
  useEditMode,
  setUseEditMode,
}: Props) {
  return (
    <div className="w-full lg:w-56 text-right">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-300 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 hidden lg:block">
              <Menu.Item>
                <div className="flex flex-row justify-end">
                  <div>
                    <SearchType
                      enabled={freeFormSearchEnabled}
                      setEnabled={setFreeFormSearchEnabled}
                    />
                  </div>
                </div>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <div className="flex flex-row justify-end">
                  <div>
                    <Switcheroo
                      enabled={useEditMode}
                      setEnabled={setUseEditMode}
                      labelText="Edit Mode"
                    />
                  </div>
                </div>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function EditInactiveIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#7dd3fc"
        stroke="#082F49"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}
