import React, { useEffect, useState } from "react";

type LoadingSpinnerProps = {
  width?: string;
  height?: string;
  showMessages?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const ANIMATION_DURATION = 1000; // 1 second for fade in/out
const DISPLAY_DURATION = 10000; // 10 seconds for display

/**
 * Loading spinner component with rotating Bible verses
 * Used to provide engaging content while data is loading
 */
export default function LoadingSpinner({
  width,
  height,
  showMessages = true,
  size = "lg",
  className = "",
}: LoadingSpinnerProps) {
  // Determine dimensions based on size prop
  const getSize = () => {
    switch (size) {
      case "sm":
        return { width: "w-6", height: "h-6" };
      case "md":
        return { width: "w-24", height: "h-24" };
      case "lg":
      default:
        return { width: "w-48", height: "h-48" };
    }
  };

  // Use provided width/height or get from size
  const { width: sizeWidth, height: sizeHeight } = getSize();
  const finalWidth = width || sizeWidth;
  const finalHeight = height || sizeHeight;

  const messages = [
    {
      reference: "Romans 3:23",
      text: "For all have sinned, and come short of the glory of God;",
    },
    {
      reference: "Romans 6:23",
      text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
    },
    {
      reference: "Romans 5:8",
      text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
    },
    {
      reference: "Romans 10:9",
      text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.",
    },
    {
      reference: "Romans 10:13",
      text: "For whosoever shall call upon the name of the Lord shall be saved.",
    },
    {
      reference: "John 3:16",
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    },
    {
      reference: "Ephesians 2:8-9",
      text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.",
    },
    {
      reference: "1 John 1:9",
      text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    },
  ];

  // Use a fixed initial index to prevent hydration mismatch
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set up client-side only effects
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);

    // Set a random message index only after hydration is complete
    setCurrentMessageIndex(Math.floor(Math.random() * messages.length));

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentMessageIndex(() =>
          Math.floor(Math.random() * messages.length)
        );
        setIsFading(false);
      }, ANIMATION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, []);

  // For small spinners, don't show messages
  const shouldShowMessages = showMessages && size !== "sm";

  return (
    <div
      className={`flex justify-center items-center h-full ${
        size === "sm" ? "" : "mt-10"
      } ${className}`}
    >
      <div
        className={`relative inline-flex items-center justify-center p-4 ${finalWidth} ${finalHeight} aspect-square`}
      >
        <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-b-4 border-primary/30">
          <div className="bg-background rounded-full w-full h-full z-10 bg-opacity-100"></div>
        </div>
        {shouldShowMessages && (
          <div
            className={`relative flex flex-col items-center justify-center text-center transition-opacity duration-${ANIMATION_DURATION} ${
              isFading ? "opacity-0" : "opacity-100"
            } w-full h-full overflow-hidden`}
          >
            <span className="text-lg font-bold text-primary text-center">
              {messages[currentMessageIndex].reference}
            </span>
            <span className="px-2 text-xs text-primary text-center">
              {messages[currentMessageIndex].text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
