import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type AsideScrollableButtonTypes = ComponentProps<"button">;

export default function AsideScrollableButton({
  className,
  children,
  ...props
}: AsideScrollableButtonTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <button
      className={twMerge(
        `capitalize text-[1.5rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } w-full focus-within:text-text-light text-text-dark hover:text-text-light bg-secondary px-[.5rem] py-[.5rem] rounded-md hover:bg-primary focus-within:bg-primary transition-all focus-within:border-[2px] focus-within:border-white`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
