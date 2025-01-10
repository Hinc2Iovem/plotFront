import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type PlotFieldInputTypes = ComponentProps<"p">;

export default function PlotfieldCommandNameField({ className, children, ...props }: PlotFieldInputTypes) {
  return (
    <p
      className={twMerge(
        `text-[17px] text-start text-text w-full capitalize px-[10px] py-[5px] rounded-md shadow-md transition-all cursor-default`,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
