import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneStatus } from "@prisma/client";

export default function StatusSelect() {
  const statuses = Object.entries(PhoneStatus);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s[0]} value={s[0]}>
            {s[0]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
