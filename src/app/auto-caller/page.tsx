import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UserPage from "../user/page";
import PhonePage from "../phone/page";
import CallPage from "../call/page";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Home() {
  return (
    <ScrollArea>
      <main className="w-full flex flex-col  mx-auto rounded-md">
        <Accordion type="single" collapsible className="py-4 min-w-[50rem]">
          <AccordionItem value="item-1">
            <AccordionTrigger>Manage Users</AccordionTrigger>
            <AccordionContent>
              <div className="py-4 w-full border-2 rounded-md">
                <UserPage />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Manage Phones</AccordionTrigger>
            <AccordionContent>
              <div className="py-4 w-full border-2 rounded-md">
                <PhonePage />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Manage Calls</AccordionTrigger>
            <AccordionContent>
              <div className="py-4 w-full border-2 rounded-md">
                <CallPage />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </ScrollArea>
  );
}
