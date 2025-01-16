import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandSound from "../../../hooks/Sound/Command/useGetCommandSound";
import useGetSoundById from "../../../hooks/Sound/useGetSoundById";
import "../Prompts/promptStyles.css";
import AllSoundsModal from "./AllSoundsModal";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandSoundField({ plotFieldCommandId, command, topologyBlockId }: CommandSoundFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Sound");
  const [initValue, setInitValue] = useState<string>("");
  const [soundName, setSoundName] = useState<string>("");

  const [commandSoundId, setCommandSoundId] = useState("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

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
    commandName: nameValue || "sound",
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
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
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
