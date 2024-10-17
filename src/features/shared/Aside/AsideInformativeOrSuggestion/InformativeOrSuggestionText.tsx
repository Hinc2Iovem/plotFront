import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type InformativeOrSuggestionTextTypes = ComponentProps<"p">;

export default function InformativeOrSuggestionText({
  className,
  children,
  ...props
}: InformativeOrSuggestionTextTypes) {
  return (
    <p
      className={twMerge("text-[1.5rem] text-text-light", className)}
      {...props}
    >
      {children}
    </p>
  );
}
