import { Input } from "@/components/ui/input";
import StoryAttributesCharacterPrompt from "../StorySinglePage/StoryAttributesSection/shared/StoryAttributesCharacterPrompt";
import { CharacterValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import StoryAttributesSelectAppearanceType from "../StorySinglePage/StoryAttributesSection/shared/StoryAttributesSelectAppearanceType";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type AppearanceFiltersTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setAppearanceSearch: React.Dispatch<React.SetStateAction<string>>;
  setCurrentAppearanceType: React.Dispatch<React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes | "temp">>;
  characterValue: CharacterValueTypes;
  appearanceSearch: string;
  width: number;
  appearanceSearchType: TranslationTextFieldNameAppearancePartsTypes | "temp";
};

export default function AppearanceFilters({
  setCharacterValue,
  setAppearanceSearch,
  setCurrentAppearanceType,
  characterValue,
  appearanceSearch,
  width,
  appearanceSearchType,
}: AppearanceFiltersTypes) {
  return (
    <form
      style={{ width: `${width + 2}px` }}
      onSubmit={(e) => e.preventDefault()}
      className={`fixed bottom-0 border-border shadow-md shadow-background bg-background border-[1px] p-[2.5px] rounded-md flex md:flex-row gap-[5px] flex-col flex-wrap`}
    >
      <div className="xl:max-w-[350px] w-full flex-grow min-w-[250px]">
        <StoryAttributesSelectAppearanceType
          filterOrForm="filter"
          setCurrentAppearanceType={setCurrentAppearanceType}
          currentAppearanceType={appearanceSearchType}
        />
      </div>
      <StoryAttributesCharacterPrompt
        characterValue={characterValue}
        imgClasses={"w-[30px] object-cover rounded-md right-0 absolute"}
        inputClasses="flex-grow text-heading min-w-[250px] md:text-[25px] border-border border-[1px] px-[10px] py-[5px] pr-[35px]"
        setCharacterValue={setCharacterValue}
      />
      <Input
        value={appearanceSearch || ""}
        onChange={(e) => setAppearanceSearch(e.target.value)}
        placeholder="Внешний Вид"
        className="flex-grow xl:max-w-[350px] w-full min-w-[250px] text-heading md:text-[25px] border-border border-[1px] px-[10px] py-[5px]"
      />
    </form>
  );
}
