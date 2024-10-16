import { useState } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandTypes } from "../../../../../types/Additional/TranslationTypes";
import PeriodPrompt from "../../InputPrompts/PeriodPrompt";
import FiltersEverythingCharacterForAppearancePartRecent from "./AboutCharacter/FiltersEverythingCharacterForAppearancePartRecent";
import FiltersEverythingCharacterForCharacterRecent from "./AboutCharacter/FiltersEverythingCharacterForCharacterRecent";
import FiltersEverythingCharacterForCharacteristicRecent from "./AboutCharacter/FiltersEverythingCharacterForCharacteristicRecent";
import FiltersEverythingStoryForEpisodeRecent from "./AboutStory/FiltersEverythingStoryForEpisodeRecent";
import FiltersEverythingStoryForSeasonRecent from "./AboutStory/FiltersEverythingStoryForSeasonRecent";
import FiltersEverythingStoryForStoryRecent from "./AboutStory/FiltersEverythingStoryForStoryRecent";
import FiltersEverythingPlotAchievementRecent from "./Plot/FiltersEverythingPlotAchievementRecent";
import FiltersEverythingPlotChoiceRecent from "./Plot/FiltersEverythingPlotChoiceRecent";
import FiltersEverythingPlotGetItemRecent from "./Plot/FiltersEverythingPlotGetItemRecent";
import FiltersEverythingPlotSayRecent from "./Plot/FiltersEverythingPlotSayRecent";
import FiltersEverythingPlotCommandWardrobeRecent from "./Plot/FiltersEverythingPlotCommandWardrobeRecent";

type FiltersEverythingCharacterForRecentTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export type UpdatedAtPossibleVariationTypes =
  | "30min"
  | "1hr"
  | "5hr"
  | "1d"
  | "3d"
  | "7d";

export type CombinedTranslatedAndNonTranslatedRecentTypes = {
  translated: TranslationCommandTypes;
  nonTranslated: TranslationCommandTypes | null;
};

export default function FiltersEverythingRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingCharacterForRecentTypes) {
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<UpdatedAtPossibleVariationTypes>(
    "" as UpdatedAtPossibleVariationTypes
  );

  console.log(setPage);

  return (
    <>
      <div className="flex w-full gap-[1rem] bg-secondary-darker px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <PeriodPrompt setPeriod={setPeriod} period={period} />
      </div>
      {translateFromLanguage && translateToLanguage ? (
        <main className="w-full flex flex-col gap-[1rem]">
          <FiltersEverythingCharacterForAppearancePartRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingCharacterForCharacterRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingCharacterForCharacteristicRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingStoryForEpisodeRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingStoryForSeasonRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingStoryForStoryRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingPlotAchievementRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingPlotChoiceRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingPlotGetItemRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingPlotSayRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
          <FiltersEverythingPlotCommandWardrobeRecent
            prevTranslateFromLanguage={prevTranslateFromLanguage}
            prevTranslateToLanguage={prevTranslateToLanguage}
            translateFromLanguage={translateFromLanguage}
            translateToLanguage={translateToLanguage}
            updatedAt={period}
            page={page}
          />
        </main>
      ) : null}
    </>
  );
}
