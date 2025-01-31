import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ParticipantForm } from "./participant-form";

// Example subcomponents for data collection
function PageOne() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-center text-3xl font-bold italic">
        Pleasure to meet you! I just need to ask you a few questions!
      </p>
    </div>
  );
}

function PageTwo() {
  return <ParticipantForm />;
}

export function InfoCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>
          <PageOne />
        </CarouselItem>
        <CarouselItem>
          <PageTwo />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
