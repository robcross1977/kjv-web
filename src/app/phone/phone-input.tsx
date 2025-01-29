import { ControllerRenderProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Phone } from "@prisma/client";

type Props = {
  field: ControllerRenderProps<Phone, "phone">;
};

export default function PhoneInput({ field }: Props) {
  return (
    <Input
      className="col-span-3"
      {...field}
      value={field.value
        ?.toString()
        .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
      onChange={(e) => {
        const rawValue = e.target.value.replace(/-/g, "");
        // Allow only numbers and limit to 10 digits
        const formattedValue = rawValue
          .replace(/\D/g, "")
          .slice(0, 10)
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        field.onChange(formattedValue);
      }}
      placeholder="123-456-7890"
      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
      maxLength={12}
      title="Please use the format: 123-456-7890"
    />
  );
}
