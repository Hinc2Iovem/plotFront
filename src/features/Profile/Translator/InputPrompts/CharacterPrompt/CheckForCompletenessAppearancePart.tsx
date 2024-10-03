import useCheckAppearancePartTranslationCompletnessByCharacterId from "../../../../../hooks/Fetching/AppearancePart/useCheckAppearancePartTranslationCompletnessByCharacterId";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CheckForCompletenessCharacterTypes = {
  appearancePartVariation?: string;
  characterId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function CheckForCompletenessAppearancePart({
  currentLanguage,
  translateToLanguage,
  appearancePartVariation,
  characterId,
}: CheckForCompletenessCharacterTypes) {
  const { data: completed } =
    useCheckAppearancePartTranslationCompletnessByCharacterId({
      currentLanguage,
      translateToLanguage,
      appearancePartVariation,
      characterId,
    });

  return (
    <div
      className={`${
        completed ? "bg-green-300" : "bg-orange-300"
      } absolute left-[.5rem] top-[.5rem] w-[.5rem] h-[.5rem] rounded-full`}
    ></div>
  );
}
