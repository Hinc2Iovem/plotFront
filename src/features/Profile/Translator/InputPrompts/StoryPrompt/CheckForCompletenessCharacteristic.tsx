import useCheckCharacteristicTranslationCompletnessByStoryId from "../../../../../hooks/Fetching/CharacterCharacteristic/useCheckCharacteristicTranslationCompletnessByStoryId";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CheckForCompletenessCharacteristicTypes = {
  storyId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function CheckForCompletenessCharacteristic({
  storyId,
  currentLanguage,
  translateToLanguage,
}: CheckForCompletenessCharacteristicTypes) {
  const { data: completed } =
    useCheckCharacteristicTranslationCompletnessByStoryId({
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
