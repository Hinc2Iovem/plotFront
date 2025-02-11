import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandSound from "../../../hooks/Sound/Command/useGetCommandSound";
import useGetSoundById from "../../../hooks/Sound/useGetSoundById";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import AllSoundsModal from "./AllSoundsModal";
import "../Prompts/promptStyles.css";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandSoundField({ plotFieldCommandId, topologyBlockId }: CommandSoundFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [initValue, setInitValue] = useState<string>("");
  const [soundName, setSoundName] = useState<string>("");

  const [commandSoundId, setCommandSoundId] = useState("");

  const { data: commandSound } = useGetCommandSound({
    plotFieldCommandId,
  });

  useEffect(() => {
    if (commandSound) {
      setCommandSoundId(commandSound._id);
    }
  }, [commandSound]);

  const { data: sound } = useGetSoundById({
    soundId: commandSound?.soundId || "",
  });

  useEffect(() => {
    if (sound) {
      setSoundName(sound.soundName);
      setInitValue(sound.soundName);
    }
  }, [sound]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "sound",
    id: plotFieldCommandId,
    text: soundName,
    topologyBlockId,
    type: "command",
  });

  const updateSoundState = (value: string) => {
    updateValue({
      episodeId: episodeId || "",
      commandName: "sound",
      id: plotFieldCommandId,
      type: "command",
      value,
    });
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"sound"}
        plotFieldCommandId={plotFieldCommandId}
      />

      <div className={`sm:w-[77%] flex-grow flex-col flex-wrap flex items-center gap-[5px] relative`}>
        <AllSoundsModal
          setSoundName={setSoundName}
          onChange={(value) => updateSoundState(value)}
          soundName={soundName}
          storyId={storyId || ""}
          setInitValue={setInitValue}
          initValue={initValue}
          commandSoundId={commandSoundId}
        />
      </div>
    </div>
  );
}
