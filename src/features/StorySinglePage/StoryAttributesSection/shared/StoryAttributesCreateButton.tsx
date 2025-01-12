import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

type StoryAttributesCreateButtonTypes = {
  createOrSave?: "create" | "save";
} & ComponentProps<"button">;

export default function StoryAttributesCreateButton({
  createOrSave = "create",
  ...props
}: StoryAttributesCreateButtonTypes) {
  return (
    <Button
      {...props}
      className="bg-brand-gradient text-white text-[20px] hover:shdow-md hover:shadow-brand-gradient-left active:scale-[.99] transition-all w-full"
    >
      {createOrSave === "create" ? `Создать` : `Сохранить`}
    </Button>
  );
}
