"use client";

import FillInTheBlank from "@/components/education/fill-in-the-blank";
import Header from "@/components/shared/header";

export default function Discipleship() {
  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      <Header />
      <h1>Just testing stuff out</h1>
      <FillInTheBlank
        question="For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
        type="random"
        numberOfBlanks={5}
      />
    </div>
  );
}
