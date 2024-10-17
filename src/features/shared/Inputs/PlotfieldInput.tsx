import { ComponentProps, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../../hooks/UI/useBlurOutline";

type PlotFieldInputTypes = ComponentProps<"input">;

export default function PlotfieldInput({
  className,
  ...props
}: PlotFieldInputTypes) {
  const theme = localStorage.getItem("theme");
  const modalRef = useRef<HTMLInputElement>(null);
  useBlurOutline({ modalRef });

  return (
    <input
      ref={modalRef}
      className={twMerge(
        `${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } w-full text-[1.5rem] text-text-light bg-secondary rounded-md shadow-sm px-[1rem] py-[.5rem] focus-within:shadow-inner transition-shadow`,
        className
      )}
      {...props}
    />
  );
}
