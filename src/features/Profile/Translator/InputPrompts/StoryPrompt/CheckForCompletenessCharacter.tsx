import useCheckCharacterTranslationCompletnessByStoryId from "../../../../../hooks/Fetching/Character/useCheckCharacterTranslationCompletnessByStoryId";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CheckForCompletenessCharacterTypes = {
  storyId: string;
  characterType?: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function CheckForCompletenessCharacter({
  storyId,
  characterType,
  currentLanguage,
  translateToLanguage,
}: CheckForCompletenessCharacterTypes) {
  const { data: completed } = useCheckCharacterTranslationCompletnessByStoryId({
    characterType,
    currentLanguage,
    storyId,
    translateToLanguage,
  });

  return (
    <div
      className={`${
        completed ? "bg-green-300" : "bg-orange-300"
      } absolute left-[.5rem] top-[.5rem] w-[.5rem] h-[.5rem] rounded-full`}
    ></div>
  );
}
