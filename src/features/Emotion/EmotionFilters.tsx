import { Input } from "@/components/ui/input";
import StoryAttributesCharacterPrompt from "../StorySinglePage/StoryAttributesSection/shared/StoryAttributesCharacterPrompt";
import { CharacterValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type EmotionFiltersTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionSearch: React.Dispatch<React.SetStateAction<string>>;
  characterValue: CharacterValueTypes;
  emotionSearch: string;
  width: number;
};

export default function EmotionFilters({
  setCharacterValue,
  setEmotionSearch,
  characterValue,
  emotionSearch,
  width,
}: EmotionFiltersTypes) {
  return (
    <form
      style={{ width: `${width + 2}px` }}
      onSubmit={(e) => e.preventDefault()}
      className={`fixed bottom-0 border-border shadow-md shadow-background bg-background border-[1px] p-[2.5px] rounded-md flex sm:flex-row gap-[5px] flex-col`}
    >
      <StoryAttributesCharacterPrompt
        characterValue={characterValue}
        imgClasses={"w-[30px] object-cover rounded-md right-0 absolute"}
        inputClasses="flex-grow text-heading md:text-[25px] border-border border-[1px] px-[10px] py-[5px] pr-[35px]"
        setCharacterValue={setCharacterValue}
      />
      <Input
        value={emotionSearch || ""}
        onChange={(e) => setEmotionSearch(e.target.value)}
        placeholder="Эмоция"
        className="flex-grow text-heading md:text-[25px] border-border border-[1px] px-[10px] py-[5px]"
      />
    </form>
  );
}
