import React, { useState, forwardRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

type Participant = {
  name: string;
  calories: number;
  meals: number;
  weight: number;
  sex: "male" | "female";
};

const defaultParticipant: Participant = {
  name: "",
  calories: 2000,
  meals: 3,
  weight: 150,
  sex: "male",
};

// Create a wrapper component for the Select
const ForwardedSelect = forwardRef<HTMLSelectElement, any>(
  ({ children, onValueChange, ...props }, ref) => {
    return (
      <select
        {...props}
        ref={ref}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {children}
      </select>
    );
  }
);

export function ParticipantForm() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const methods = useForm<Participant>();

  const addParticipant = () => {
    setParticipants([...participants, { ...defaultParticipant }]);
  };

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string | number
  ) => {
    const updatedParticipants = participants.map((participant, i) =>
      i === index ? { ...participant, [field]: value } : participant
    );
    setParticipants(updatedParticipants);
  };

  return (
    <div className="p-4">
      {participants.map((participant, index) => (
        <FormProvider {...methods} key={index}>
          <form>
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name"
                      value={participant.name}
                      onChange={(e) =>
                        updateParticipant(index, "name", e.target.value)
                      }
                      className="mb-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Calories"
                      value={participant.calories}
                      onChange={(e) =>
                        updateParticipant(
                          index,
                          "calories",
                          Number(e.target.value)
                        )
                      }
                      className="mb-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="meals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meals Per Day</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Meals"
                      value={participant.meals}
                      onChange={(e) =>
                        updateParticipant(
                          index,
                          "meals",
                          Number(e.target.value)
                        )
                      }
                      className="mb-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Weight"
                      value={participant.weight}
                      onChange={(e) =>
                        updateParticipant(
                          index,
                          "weight",
                          Number(e.target.value)
                        )
                      }
                      className="mb-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <ForwardedSelect
                      {...field}
                      value={participant.sex}
                      onValueChange={(value: string) =>
                        updateParticipant(index, "sex", value)
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </ForwardedSelect>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
      ))}
      <Button onClick={addParticipant} className="mt-4">
        + Add Participant
      </Button>
    </div>
  );
}
