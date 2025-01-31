import { Phone } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface PhoneComboboxProps<T extends Phone> {
  phones: T[];
  form: UseFormReturn<{ phone: T }>;
  field: ControllerRenderProps<{ phone: T }>;
}

export function PhoneCombobox({
  phones,
  field,
  form,
}: PhoneComboboxProps<Phone>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value && (field.value as Phone)?.id
              ? (field.value as Phone)?.id
              : "Select phone"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search phones..." className="h-9" />
          <CommandList>
            <CommandEmpty>No phone found.</CommandEmpty>
            <CommandGroup>
              {phones.map((phone) => (
                <CommandItem
                  value={phone.phone}
                  key={phone.phone}
                  onSelect={() => {
                    form.setValue("phone", phone, { shouldValidate: true });
                  }}
                >
                  {`${phone.name}:${phone.phone}`}
                  <Check
                    className={cn(
                      "ml-auto",
                      phone.id === (field.value as Phone)?.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
