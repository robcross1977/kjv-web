import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneStatus } from "@prisma/client";
import { FieldValues } from "react-hook-form";

export default function PhoneStatusFormItem({ field }: { field: FieldValues }) {
  return (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {Object.entries(PhoneStatus).map((s) => (
            <SelectItem key={s[0]} value={s[0]}>
              {s[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
}
