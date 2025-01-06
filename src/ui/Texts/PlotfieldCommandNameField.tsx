import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type PlotFieldInputTypes = ComponentProps<"p">;

export default function PlotfieldCommandNameField({ className, children, ...props }: PlotFieldInputTypes) {
  return (
    <p
      className={twMerge(
        `text-[1.4rem] text-start text-text-light outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary transition-all cursor-default`,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
