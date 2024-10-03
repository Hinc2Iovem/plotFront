import useCheckSeasonTranslationCompletnessByStoryId from "../../../../../hooks/Fetching/Season/useCheckSeasonTranslationCompletnessByStoryId";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CheckForCompletenessSeasonTypes = {
  storyId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function CheckForCompletenessSeason({
  storyId,
  currentLanguage,
  translateToLanguage,
}: CheckForCompletenessSeasonTypes) {
  const { data: completed } = useCheckSeasonTranslationCompletnessByStoryId({
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
