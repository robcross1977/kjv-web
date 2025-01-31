"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ParticipantForm } from "./participant-form";
import { Likes } from "./likes";
import { Dislikes } from "./dislikes";
import Budget from "./budget";
import { DietaryRestrictions } from "./dietary-restrictions";
import ValidateComponent from "./validate";
const LAST_INDEX_KEY = "lastCarouselIndex";

export function InfoCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;

    const lastIndex = localStorage.getItem(LAST_INDEX_KEY);
    if (lastIndex !== null) {
      api.scrollTo(Number(lastIndex));
    }

    const handleSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      localStorage.setItem(LAST_INDEX_KEY, currentIndex.toString());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-3xl font-bold italic">
              Pleasure to meet you! I just need to ask you a few questions!
            </p>
          </div>
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            How much are you spending?
          </h1>
          <Budget />
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            Who are you cooking for?
          </h1>
          <ParticipantForm />
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            What does your family like to eat?
          </h1>
          <Likes />
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            What does your family NOT like to eat?
          </h1>
          <Dislikes />
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            Any dietary restrictions?
          </h1>
          <DietaryRestrictions />
        </CarouselItem>
        <CarouselItem>
          <h1 className="text-3xl font-bold italic my-4">
            We think we got it all! Let's check it over!
          </h1>
          <ValidateComponent />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
