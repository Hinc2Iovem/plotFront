import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../../hooks/UI/useBlurOutline";

type PlotFieldInputTypes = ComponentProps<"input">;

const PlotfieldInput = forwardRef<HTMLDivElement, PlotFieldInputTypes>(
  ({ className, ...props }, ref) => {
    const theme = localStorage.getItem("theme");
    const modalRef = useRef<HTMLInputElement>(null);
    useBlurOutline({ modalRef });

    console.log(ref);

    return (
      <input
        ref={modalRef}
        className={twMerge(
          `${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } w-full text-[1.5rem] text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`,
          className
        )}
        {...props}
      />
    );
  }
);
PlotfieldInput.displayName = "PlotfieldInput";

export default PlotfieldInput;
