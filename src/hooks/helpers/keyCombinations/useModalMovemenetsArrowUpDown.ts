import { useCallback, useEffect, useRef } from "react";

type ModalMovemenetsArrowUpDownTypes = {
  length: number;
  onSelect?: (index: number) => void;
};

export default function useModalMovemenetsArrowUpDown({ length, onSelect }: ModalMovemenetsArrowUpDownTypes) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const focusedIndexRef = useRef<number>(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();

      if (key !== "arrowdown" && key !== "arrowup" && key !== "enter") return;

      event.preventDefault();

      if (!buttonsRef.current.length) return;

      let currentIndex = focusedIndexRef.current;
      if (currentIndex < 0 || document.activeElement !== buttonsRef.current[currentIndex]) {
        currentIndex = buttonsRef.current.findIndex((button) => button === document.activeElement);
        focusedIndexRef.current = currentIndex;
      }

      if (key === "arrowdown") {
        const nextIndex = (currentIndex + 1) % length;
        buttonsRef.current[nextIndex]?.focus();
        focusedIndexRef.current = nextIndex;
      } else if (key === "arrowup") {
        const prevIndex = (currentIndex - 1 + length) % length;
        buttonsRef.current[prevIndex]?.focus();
        focusedIndexRef.current = prevIndex;
      } else if (key === "enter" && onSelect) {
        if (focusedIndexRef.current >= 0) {
          onSelect(focusedIndexRef.current);
        } else {
          onSelect(0);
        }
      }
    },
    [length, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return buttonsRef;
}
