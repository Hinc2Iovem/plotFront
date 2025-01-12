import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

type StoryAttributesCreateButtonTypes = {
  clear: () => void;
} & ComponentProps<"button">;

export default function StoryAttributesClearButton({ clear, className, ...props }: StoryAttributesCreateButtonTypes) {
  return (
    <Button
      {...props}
      onClick={clear}
      type="button"
      className={`${className} bg-orange hover:bg-red active:scale-[.99] transition-all  text-white text-[20px] w-full`}
    >
      Сбросить
    </Button>
  );
}
