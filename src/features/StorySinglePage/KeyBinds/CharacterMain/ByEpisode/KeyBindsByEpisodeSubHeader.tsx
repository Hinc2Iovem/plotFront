import { useParams } from "react-router-dom";
import EpisodePrompt from "../../../../Profile/Translator/InputPrompts/EpisodePrompt";
import SeasonPrompt from "../../../../Profile/Translator/InputPrompts/SeasonPrompt/SeasonPrompt";
import { KeyBindsCharacterSubCategoryTypes } from "../../KeyBinds";

type KeyBindsByEpisodeSubHeaderTypes = {
  characterSubCategory: KeyBindsCharacterSubCategoryTypes;
  setSeasonId: React.Dispatch<React.SetStateAction<string>>;
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
  setSeasonValue: React.Dispatch<React.SetStateAction<string>>;
  setEpisodeCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  episodeCurrentValue: string;
  seasonValue: string;
  seasonId: string;
};

export default function KeyBindsByEpisodeSubHeader({
  characterSubCategory,
  episodeCurrentValue,
  seasonValue,
  seasonId,
  setEpisodeCurrentValue,
  setEpisodeId,
  setSeasonId,
  setSeasonValue,
}: KeyBindsByEpisodeSubHeaderTypes) {
  const { storyId } = useParams();

  return (
    <div
      className={`${
        characterSubCategory === "byEpisode" ? "" : "hidden"
      } flex gap-[1rem]`}
    >
      <SeasonPrompt
        setSeasonId={setSeasonId}
        storyId={storyId || ""}
        seasonValue={seasonValue}
        setSeasonValue={setSeasonValue}
      />
      <EpisodePrompt
        seasonId={seasonId}
        setEpisodeId={setEpisodeId}
        setEpisodeCurrentValue={setEpisodeCurrentValue}
        episodeCurrentValue={episodeCurrentValue}
      />
    </div>
  );
}
