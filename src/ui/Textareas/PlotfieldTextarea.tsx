import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../hooks/UI/useBlurOutline";

type PlotFieldTextareaTypes = ComponentProps<"textarea">;

const PlotfieldTextarea = forwardRef<HTMLTextAreaElement, PlotFieldTextareaTypes>(({ className, ...props }, ref) => {
  const theme = localStorage.getItem("theme");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resolvedRef = ref || inputRef;

  useBlurOutline({
    modalRef: resolvedRef as React.MutableRefObject<HTMLTextAreaElement | null>,
  });
  return (
    <textarea
      ref={resolvedRef}
      className={twMerge(
        `w-full ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`,
        className
      )}
      {...props}
    />
  );
});

PlotfieldTextarea.displayName = "PlotfieldTextarea";

export default PlotfieldTextarea;
