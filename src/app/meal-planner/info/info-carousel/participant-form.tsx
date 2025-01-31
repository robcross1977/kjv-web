"use client";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useEffect } from "react";

type Participant = {
  name: string;
  calories: number;
  weight: number;
  sex: "male" | "female";
};

const defaultParticipant: Participant = {
  name: "Family Member #1",
  calories: 2200,
  weight: 185,
  sex: "female",
};

interface SelectProps {
  children: React.ReactNode;
  onValueChange: (value: string) => void;
  [key: string]: any; // Allows for additional props
}

const Select = ({ children, onValueChange, ...props }: SelectProps) => {
  return (
    <select
      {...props}
      onChange={(e) => onValueChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {children}
    </select>
  );
};

export function ParticipantForm() {
  const [participants, setParticipants] = useLocalStorage<Participant[]>(
    "participants",
    []
  );
  const [participantCount, setParticipantCount] = useLocalStorage<number>(
    "participantCount",
    participants.length
  );

  useEffect(() => {
    if (participants.length === 0) {
      setParticipants([defaultParticipant]);
      setParticipantCount(1);
    }
  }, [participants, setParticipants, setParticipantCount]);

  const methods = useForm<Participant>({
    defaultValues:
      participants.length > 0 ? participants[0] : defaultParticipant,
  });

  const addParticipant = () => {
    const newParticipant = {
      ...defaultParticipant,
      name: `Family Member #${participantCount + 1}`,
    };
    setParticipants([...participants, newParticipant]);
    setParticipantCount(participantCount + 1);
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
    setParticipantCount(updatedParticipants.length);
  };

  return (
    <div className="p-4">
      <Accordion type="single" collapsible>
        {participants.map((participant, index) => (
          <AccordionItem key={index} value={`participant-${index}`}>
            <AccordionTrigger className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              {participant.name}
            </AccordionTrigger>
            <AccordionContent className="ml-8">
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
                          <Select
                            {...field}
                            value={participant.sex}
                            onValueChange={(value: string) =>
                              updateParticipant(index, "sex", value)
                            }
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </Select>
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
        + Add Family Member
      </Button>
    </div>
  );
}
