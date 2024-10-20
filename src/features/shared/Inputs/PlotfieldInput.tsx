import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../../hooks/UI/useBlurOutline";

type PlotFieldInputTypes = ComponentProps<"input">;

const PlotfieldInput = forwardRef<HTMLDivElement, PlotFieldInputTypes>(
  ({ className, ...props }, ref) => {
    const theme = localStorage.getItem("theme");
    const modalRef = useRef<HTMLInputElement>(null);
    useBlurOutline({ modalRef });

    return (
      <input
        ref={modalRef}
        className={twMerge(
          `${
            theme === "light"
              ? "outline-gray-300 bg-secondary"
              : "outline-gray-600 bg-secondary"
          } w-full text-[1.5rem] text-text-light rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`,
          className
        )}
        {...props}
      />
    );
  }
);
PlotfieldInput.displayName = "PlotfieldInput";

export default PlotfieldInput;
