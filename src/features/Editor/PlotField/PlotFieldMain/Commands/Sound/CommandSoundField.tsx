import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandSound from "../../../hooks/Sound/useGetCommandSound";
import useGetSoundById from "../../../hooks/Sound/useGetSoundById";
import AllSoundsModal from "./AllSoundsModal";
import CreateSoundField from "./CreateSoundField";
import "../Prompts/promptStyles.css";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandSoundField({ plotFieldCommandId, command, topologyBlockId }: CommandSoundFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [showCreateSoundModal, setShowCreateSoundModal] = useState(false);
  const [nameValue] = useState<string>(command ?? "Sound");
  const [initValue, setInitValue] = useState<string>("");
  const [soundName, setSoundName] = useState<string>("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const { data: commandSound } = useGetCommandSound({
    plotFieldCommandId,
  });
  const [commandSoundId, setCommandSoundId] = useState("");
  const { data: sound } = useGetSoundById({
    soundId: commandSound?.soundId || "",
  });

  useEffect(() => {
    if (commandSound) {
      setCommandSoundId(commandSound._id);
    }
  }, [commandSound]);

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
          setShowCreateSoundModal={setShowCreateSoundModal}
          setSoundName={setSoundName}
          soundId={commandSound?.soundId || ""}
          onChange={(value) => updateSoundState(value)}
          soundName={soundName}
          storyId={storyId || ""}
          setInitValue={setInitValue}
          initValue={initValue}
        />
      </div>

      <CreateSoundField
        commandSoundId={commandSoundId}
        setShowModal={setShowCreateSoundModal}
        showModal={showCreateSoundModal}
        storyId={storyId || ""}
        soundName={soundName}
      />
    </div>
  );
}
