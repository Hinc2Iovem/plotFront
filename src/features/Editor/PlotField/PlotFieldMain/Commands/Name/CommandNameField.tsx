import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import PlotfieldUnknownCharacterPromptMain, {
  UnknownCharacterValueTypes,
} from "../Prompts/Characters/UnknownCharacters/PlotfieldUnknownCharacterPromptMain";

type CommandNameFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandNameField({ plotFieldCommandId, topologyBlockId }: CommandNameFieldTypes) {
  const { episodeId } = useParams();

  const { updateValue } = useSearch();

  const onBlurUpdateSearchValue = (character: UnknownCharacterValueTypes) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "name",
        id: plotFieldCommandId,
        type: "command",
        value: `${character.characterUnknownName} ${character.characterName}`,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField nameValue={"name"} plotFieldCommandId={plotFieldCommandId} />
      <div className="flex gap-[5px] sm:flex-row flex-col flex-grow">
        <PlotfieldUnknownCharacterPromptMain
          onBlur={(value) => {
            onBlurUpdateSearchValue(value);
          }}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={plotFieldCommandId}
        />
      </div>
    </div>
  );
}
