import { Button } from "@/components/ui/button";

type StoryAttributesCreateButtonTypes = {
  clear: () => void;
};

export default function StoryAttributesClearButton({ clear }: StoryAttributesCreateButtonTypes) {
  return (
    <Button
      onClick={clear}
      type="button"
      className={`bg-orange hover:bg-red active:scale-[.99] transition-all  text-white text-[20px] w-full`}
    >
      Сбросить
    </Button>
  );
}
