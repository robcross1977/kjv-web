"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "./results";
import { columns } from "./columns";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  prompt: z.string().nonempty(),
});

export default function AI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ai/summarizer",
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <ScrollArea>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <Input
                  {...field}
                  className="rounded shadow-xl"
                  value={input}
                  placeholder="Ask for a summarization of something from the bible..."
                  disabled={isLoading}
                  onChange={handleInputChange}
                />
              )}
            />
          </form>
        </Form>
      </ScrollArea>
      <DataTable
        columns={columns}
        data={messages.sort((m1, m2) => {
          const first = new Date(m1.createdAt ?? "");
          const second = new Date(m2.createdAt ?? "");
          return second >= first ? 1 : -1;
        })}
      />
    </div>
  );
}
