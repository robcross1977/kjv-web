import React, { useState, useEffect, forwardRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
  const [participants, setParticipants] = useState<Participant[]>(() => {
    // Load initial participants from local storage
    const savedParticipants = localStorage.getItem("participants");
    return savedParticipants ? JSON.parse(savedParticipants) : [];
  });

  const methods = useForm<Participant>({
    defaultValues:
      participants.length > 0 ? participants[0] : defaultParticipant,
  });

  const addParticipant = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newParticipant = {
      ...defaultParticipant,
      name: `Player #${randomId}`,
    };
    setParticipants([...participants, newParticipant]);
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

  const deleteParticipant = (index: number) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  useEffect(() => {
    // Save participants to local storage whenever they change
    localStorage.setItem("participants", JSON.stringify(participants));
  }, [participants]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold my-4">Who are you cooking for?</h1>
      <Accordion type="single" collapsible>
        {participants.map((participant, index) => (
          <AccordionItem key={index} value={`participant-${index}`}>
            <AccordionTrigger>{participant.name}</AccordionTrigger>
            <AccordionContent>
              <FormProvider {...methods}>
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
              <Button onClick={() => deleteParticipant(index)} className="mt-2">
                Delete User
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button onClick={addParticipant} className="mt-4">
        + Add Participant
      </Button>
    </div>
  );
}
