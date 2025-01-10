import { useEffect, useRef } from "react";

type ModalMovemenetsArrowUpDownTypes = {
  length: number;
};

export default function useModalMovemenetsArrowUpDown({ length }: ModalMovemenetsArrowUpDownTypes) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();

      if (key === "arrowdown" || key === "arrowup") {
        event.preventDefault();

        const currentIndex = buttonsRef.current.findIndex((button) => button === document.activeElement);

        if (!buttonsRef.current.length) {
          return;
        }

        if (currentIndex < 0) {
          buttonsRef.current[0]?.focus();
        } else if (key === "arrowdown") {
          if (currentIndex === length - 1) {
            buttonsRef.current[0]?.focus();
          } else {
            const nextIndex = (currentIndex + 1) % length;
            buttonsRef.current[nextIndex]?.focus();
          }
        } else if (key === "arrowup") {
          if (currentIndex === 0) {
            buttonsRef.current[length - 1]?.focus();
          } else {
            const prevIndex = (currentIndex - 1 + length) % length;
            buttonsRef.current[prevIndex]?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [length]);

  return buttonsRef;
}
