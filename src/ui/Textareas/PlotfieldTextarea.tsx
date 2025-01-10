import { ComponentProps, forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import useBlurOutline from "../../hooks/UI/useBlurOutline";
import { Textarea } from "@/components/ui/textarea";

type PlotFieldTextareaTypes = ComponentProps<"textarea">;

const PlotfieldTextarea = forwardRef<HTMLTextAreaElement, PlotFieldTextareaTypes>(({ className, ...props }, ref) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resolvedRef = ref || inputRef;

  useBlurOutline({
    modalRef: resolvedRef as React.MutableRefObject<HTMLTextAreaElement | null>,
  });
  return (
    <Textarea
      ref={resolvedRef}
      className={twMerge(
        `w-full text-text md:text-[17px] px-[10px] py-[5px] rounded-md h-full min-h-[105px] max-h-[200px]`,
        className
      )}
      {...props}
    />
  );
});

PlotfieldTextarea.displayName = "PlotfieldTextarea";

export default PlotfieldTextarea;
