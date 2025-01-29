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
import { User } from "@prisma/client";

export default function UserForm({
  form,
  onSubmit,
  type,
  hideUid = false,
}: {
  form: UseFormReturn<User, unknown, undefined>;
  onSubmit: (data: any) => void;
  type: "update" | "insert";
  hideUid?: boolean;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (type === "insert") {
            const { uid, ...insertData } = data;
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
            name="uid"
            render={({ field }) => (
              <FormItem
                hidden={hideUid}
                className="grid grid-cols-4 items-center gap-4"
              >
                <FormLabel>UID</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    {...field}
                    disabled
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="col-span-3"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="col-span-3"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  className="col-span-3"
                  {...field}
                  value={field.value ?? ""}
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
