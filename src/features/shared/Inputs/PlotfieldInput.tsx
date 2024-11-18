import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../../hooks/UI/useBlurOutline";

type PlotFieldInputTypes = ComponentProps<"input">;

type PlotfieldInputPropsTypes = {
  setFocusedSecondTime?: React.Dispatch<React.SetStateAction<boolean>>;
  focusedSecondTime?: boolean;
  outlineNone?: boolean;
};

const PlotfieldInput = forwardRef<HTMLInputElement, PlotFieldInputTypes & PlotfieldInputPropsTypes>(
  ({ className, outlineNone = false, ...props }, ref) => {
    const theme = localStorage.getItem("theme");

    const inputRef = useRef<HTMLInputElement>(null);
    const resolvedRef = ref || inputRef;

    useBlurOutline({
      modalRef: resolvedRef as React.MutableRefObject<HTMLInputElement | null>,
    });

    return (
      <input
        ref={resolvedRef}
        className={twMerge(
          `${
            outlineNone
              ? "outline-none"
              : theme === "light"
              ? "outline-gray-300 bg-secondary"
              : "outline-gray-900 bg-secondary"
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
