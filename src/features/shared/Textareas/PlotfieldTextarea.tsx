import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type PlotFieldTextareaTypes = ComponentProps<"textarea">;

export default function PlotfieldTextarea({
  className,
  ...props
}: PlotFieldTextareaTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <textarea
      className={twMerge(
        `w-full ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`,
        className
      )}
      {...props}
    />
  );
}
