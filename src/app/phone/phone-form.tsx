import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Phone } from "@prisma/client";

export default function PhoneForm({
  form,
  onSubmit,
  type,
  hideUid = false,
}: {
  form: UseFormReturn<Phone, unknown, undefined>;
  onSubmit: (data: any) => void;
  type: "update" | "insert";
  hideUid?: boolean;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (type === "insert") {
            const { id, ...insertData } = data;
            onSubmit(insertData);
          } else {
            onSubmit(data);
          }
        })}
        className="grid gap-4"
      >
        {type === "update" ? (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem
                hidden={hideUid}
                className="grid grid-cols-4 items-center gap-4"
              >
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    {...field}
                    disabled
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input
                  className="col-span-3"
                  {...field}
                  value={field.value?.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "$1-$2-$3"
                  )}
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
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
