import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type InformativeOrSuggestionButtonTypes = ComponentProps<"button">;

const InformativeOrSuggestionButton = forwardRef<
  HTMLButtonElement,
  InformativeOrSuggestionButtonTypes
>(({ className, children, ...props }: InformativeOrSuggestionButtonTypes) => {
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
});

InformativeOrSuggestionButton.displayName = "InformativeOrSuggestionButton";

export default InformativeOrSuggestionButton;
