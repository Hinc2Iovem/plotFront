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
      className={`${completed ? "bg-green" : "bg-orange"} absolute left-[5px] top-[5px] w-[5px] h-[5px] rounded-full`}
    ></div>
  );
}
