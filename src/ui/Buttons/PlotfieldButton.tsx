import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type PlotFieldButtonTypes = ComponentProps<"button">;

export default function PlotfieldButton({ className, children, ...props }: PlotFieldButtonTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <button
      className={twMerge(
        `text-[1.4rem] w-full text-text-light ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } hover:bg-primary focus-within:text-text-light hover:text-text-light bg-secondary transition-all active:bg-primary-darker rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
