import { useState } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandTypes } from "../../../../../types/Additional/TranslationTypes";
import EpisodePrompt from "../../InputPrompts/EpisodePrompt";
import SeasonPrompt from "../../InputPrompts/SeasonPrompt/SeasonPrompt";
import StoryPrompt from "../../InputPrompts/StoryPrompt/StoryPrompt";
import TopologyBlockPrompt from "../../InputPrompts/TopologyBlockPrompt";
import FiltersEverythingPlotGetItem from "./FiltersEverythingPlotGetItem";
import FiltersEverythingPlotCommandWardrobe from "./FiltersEverythingPlotCommandWardrobe";
import FiltersEverythingPlotChoice from "./FiltersEverythingPlotChoice";
import FiltersEverythingPlotAchievement from "./FiltersEverythingPlotAchievement";
import FiltersEverythingPlotSay from "./FiltersEverythingPlotSay";

type FiltersEverythingPlotTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

// type CombinedMultipleCommandsTranslatedAndNonTranslatedPlotTypes = {
//   oneLiners: {
//     translated: TranslationCommandTypes[];
//     nonTranslated: TranslationCommandTypes[] | null;
//   };
//   choice: {
//     translated: TranslationCommandTypes[];
//     nonTranslated: TranslationCommandTypes[] | null;
//   };
//   getItem: {
//     translated: { getItemGrouped: TranslationCommandTypes[] }[];
//     nonTranslated:
//       | { getItemGrouped: TranslationCommandTypes[] }[]
//       | { getItemGrouped: null }[];
//   };
// };

export type CombinedTranslatedAndNonTranslatedPlotTypes = {
  translated: TranslationCommandTypes;
  nonTranslated: TranslationCommandTypes | null;
};

export default function FiltersEverythingPlot({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingPlotTypes) {
  const [storyId, setStoryId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [topologyBlockId, setTopologyBlockId] = useState("");

  return (
    <>
      <div className="flex w-full gap-[1rem] bg-neutral-alabaster px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <StoryPrompt
          currentLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
          setStoryId={setStoryId}
        />
        <SeasonPrompt setSeasonId={setSeasonId} storyId={storyId} />
        <EpisodePrompt seasonId={seasonId} setEpisodeId={setEpisodeId} />
        <TopologyBlockPrompt
          episodeId={episodeId}
          setTopologyBlockId={setTopologyBlockId}
        />
      </div>
      <main className="w-full flex flex-col gap-[1rem]">
        <FiltersEverythingPlotSay
          prevTranslateFromLanguage={prevTranslateFromLanguage}
          prevTranslateToLanguage={prevTranslateToLanguage}
          topologyBlockId={topologyBlockId}
          translateFromLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
        <FiltersEverythingPlotAchievement
          prevTranslateFromLanguage={prevTranslateFromLanguage}
          prevTranslateToLanguage={prevTranslateToLanguage}
          topologyBlockId={topologyBlockId}
          translateFromLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
        <FiltersEverythingPlotCommandWardrobe
          prevTranslateFromLanguage={prevTranslateFromLanguage}
          prevTranslateToLanguage={prevTranslateToLanguage}
          topologyBlockId={topologyBlockId}
          translateFromLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
        <FiltersEverythingPlotGetItem
          prevTranslateFromLanguage={prevTranslateFromLanguage}
          prevTranslateToLanguage={prevTranslateToLanguage}
          topologyBlockId={topologyBlockId}
          translateFromLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
        <FiltersEverythingPlotChoice
          prevTranslateFromLanguage={prevTranslateFromLanguage}
          prevTranslateToLanguage={prevTranslateToLanguage}
          topologyBlockId={topologyBlockId}
          translateFromLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
      </main>
    </>
  );
}
