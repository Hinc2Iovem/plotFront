import useCheckEpisodeTranslationCompletnessBySeasonId from "../../../../../hooks/Fetching/Episode/useCheckEpisodeTranslationCompletnessBySeasonId";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CheckForCompletenessEpisodeTypes = {
  seasonId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function CheckForCompletenessEpisode({
  seasonId,
  currentLanguage,
  translateToLanguage,
}: CheckForCompletenessEpisodeTypes) {
  const { data: completed } = useCheckEpisodeTranslationCompletnessBySeasonId({
    currentLanguage,
    seasonId,
    translateToLanguage,
  });

  console.log(completed);

  return (
    <div
      className={`${
        completed ? "bg-green-300" : "bg-orange-300"
      } absolute left-[.5rem] top-[.5rem] w-[.5rem] h-[.5rem] rounded-full`}
    ></div>
  );
}
