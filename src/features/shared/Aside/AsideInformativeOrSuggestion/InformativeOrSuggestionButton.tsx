import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type InformativeOrSuggestionButtonTypes = ComponentProps<"button">;

export default function InformativeOrSuggestionButton({
  className,
  children,
  ...props
}: InformativeOrSuggestionButtonTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <button
      className={twMerge(
        `self-end text-[1.6rem] w-fit rounded-md bg-secondary shadow-sm ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } focus-within:border-black focus-within:border-[2px] focus-within:text-black`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
