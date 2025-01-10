import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../hooks/UI/useBlurOutline";
import { Input } from "@/components/ui/input";

type PlotFieldInputTypes = ComponentProps<"input">;

type PlotfieldInputPropsTypes = {
  setFocusedSecondTime?: React.Dispatch<React.SetStateAction<boolean>>;
  focusedSecondTime?: boolean;
};

const PlotfieldInput = forwardRef<HTMLInputElement, PlotFieldInputTypes & PlotfieldInputPropsTypes>(
  ({ className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const resolvedRef = ref || inputRef;

    useBlurOutline({
      modalRef: resolvedRef as React.MutableRefObject<HTMLInputElement | null>,
    });

    return (
      <Input
        ref={resolvedRef}
        className={twMerge(
          `w-full md:text-[17px] text-text rounded-md px-[10px] py-[5px] transition-shadow`,
          className
        )}
        {...props}
      />
    );
  }
);
PlotfieldInput.displayName = "PlotfieldInput";

export default PlotfieldInput;
