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
import { PhoneStatus } from "@prisma/client";

export default function AdminForm({
  form,
  onSubmit,
  type,
  hideUid = false,
}: {
  form: UseFormReturn<PhoneStatus, unknown, undefined>;
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
          name="status"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input className="col-span-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
