"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  flattenReference,
  ReferenceResponse,
  referenceResponseSchema,
} from "@/types/bible";
import { experimental_useObject as useObject } from "ai/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "./results";
import { columns } from "./columns";

const formSchema = z.object({
  prompt: z.string().nonempty(),
});

export default function AI() {
  const [results, setResults] = useState<ReferenceResponse | null>(null);
  const { submit, isLoading } = useObject({
    api: "/api/ai",
    schema: referenceResponseSchema,
    onFinish({ object }) {
      if (object != null) {
        setResults(object);
        setInput("");
      }
    },
    onError: (e) => {
      console.log(`error: ${JSON.stringify(e)}`);
    },
  });
  const [input, setInput] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const onSubmit = form.handleSubmit(({ prompt }) => {
    submit({ prompt });
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <Input
                {...field}
                className="rounded shadow-xl"
                value={input}
                placeholder="Ask something about the bible..."
                disabled={isLoading}
                onChange={(e) => {
                  setInput(e.target.value);
                  field.onChange(e);
                }}
              />
            )}
          />
        </form>
      </Form>
      <DataTable
        columns={columns}
        data={
          results ? results.references.flatMap((r) => flattenReference(r)) : []
        }
      />
    </div>
  );
}
