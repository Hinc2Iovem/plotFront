import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type AsideInformativeOrSuggestionTypes = ComponentProps<"aside">;

export default function AsideInformativeOrSuggestion({
  className,
  children,
  ...props
}: AsideInformativeOrSuggestionTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <aside
      className={twMerge(
        `${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } absolute p-[1rem] flex flex-col gap-[.5rem] w-full text-[1.5rem] text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`,
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
