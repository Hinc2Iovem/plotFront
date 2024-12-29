import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandSound from "../../../hooks/Sound/useGetCommandSound";
import useGetSoundById from "../../../hooks/Sound/useGetSoundById";
import "../Prompts/promptStyles.css";
import AllSoundsModal from "./AllSoundsModal";
import CreateSoundField from "./CreateSoundField";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandSoundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandSoundField({ plotFieldCommandId, command, topologyBlockId }: CommandSoundFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [showSoundDropDown, setShowSoundDropDown] = useState(false);
  const [showCreateSoundModal, setShowCreateSoundModal] = useState(false);
  const [nameValue] = useState<string>(command ?? "Sound");
  const [initValue, setInitValue] = useState<string>("");
  const [soundName, setSoundName] = useState<string>("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const debouncedValue = useDebounce({ value: soundName, delay: 600 });

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

  const soundRef = useRef<{ handleUpdatingSoundState: () => void }>(null);

  const updateSoundState = () => {
    if (soundRef) {
      soundRef.current?.handleUpdatingSoundState();
      updateValue({
        episodeId: episodeId || "",
        commandName: "sound",
        id: plotFieldCommandId,
        type: "command",
        value: soundName,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <div className={`sm:w-[77%] flex-grow w-full flex-col flex-wrap flex items-center gap-[1rem] relative`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateSoundState();
          }}
          className="w-full"
        >
          <PlotfieldInput
            onBlur={updateSoundState}
            onClick={(e) => {
              e.stopPropagation();
              setShowSoundDropDown((prev) => !prev);
            }}
            value={soundName || ""}
            onChange={(e) => {
              setShowSoundDropDown(true);
              setSoundName(e.target.value);
              setShowCreateSoundModal(false);
            }}
            placeholder="Звук"
          />

          <AllSoundsModal
            debouncedValue={debouncedValue}
            setShowCreateSoundModal={setShowCreateSoundModal}
            setShowSoundDropDown={setShowSoundDropDown}
            setSoundName={setSoundName}
            showSoundDropDown={showSoundDropDown}
            soundId={commandSound?.soundId || ""}
            soundName={soundName}
            storyId={storyId || ""}
            ref={soundRef}
            setInitValue={setInitValue}
            initValue={initValue}
          />
        </form>
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
