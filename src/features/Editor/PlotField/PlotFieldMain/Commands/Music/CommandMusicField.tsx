import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandMusic from "../../../hooks/Music/useGetCommandMusic";
import useGetMusicById from "../../../hooks/Music/useGetMusicById";
import "../Prompts/promptStyles.css";
import AllMusicModal from "./AllMusicModal";
import CreateMusicField from "./CreateMusicField";

type CommandMusicFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandMusicField({ plotFieldCommandId, command, topologyBlockId }: CommandMusicFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Music");
  const [musicName, setMusicName] = useState<string>("");
  const [showMusicDropDown, setShowMusicDropDown] = useState(false);
  const [showCreateMusicModal, setShowCreateMusicModal] = useState(false);

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const debouncedValue = useDebounce({ value: musicName, delay: 600 });

  const { data: commandMusic } = useGetCommandMusic({
    plotFieldCommandId,
  });

  const [commandMusicId, setCommandMusicId] = useState("");
  const { data: music } = useGetMusicById({
    musicId: commandMusic?.musicId || "",
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "music",
    id: plotFieldCommandId,
    text: musicName,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandMusic) {
      setCommandMusicId(commandMusic._id);
    }
  }, [commandMusic]);

  useEffect(() => {
    if (music) {
      setMusicName(music.musicName);
    }
  }, [music]);

  const musicRef = useRef<{ handleUpdatingMusicState: () => void }>(null);

  const updateMusicState = () => {
    if (musicRef) {
      musicRef.current?.handleUpdatingMusicState();
      updateValue({
        episodeId: episodeId || "",
        commandName: "music",
        id: plotFieldCommandId,
        type: "command",
        value: musicName,
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
            updateMusicState();
          }}
          className="w-full"
        >
          <PlotfieldInput
            onBlur={updateMusicState}
            onClick={(e) => {
              e.stopPropagation();
              setShowMusicDropDown((prev) => !prev);
            }}
            value={musicName || ""}
            onChange={(e) => {
              setShowMusicDropDown(true);
              setMusicName(e.target.value);
            }}
            placeholder="Музыка"
          />
        </form>

        <AllMusicModal
          debouncedValue={debouncedValue}
          musicId={commandMusic?.musicId || ""}
          musicName={musicName}
          setMusicName={setMusicName}
          setShowCreateMusicModal={setShowCreateMusicModal}
          setShowMusicDropDown={setShowMusicDropDown}
          showMusicDropDown={showMusicDropDown}
          storyId={storyId || ""}
          ref={musicRef}
        />
      </div>

      <CreateMusicField
        commandMusicId={commandMusicId}
        setShowModal={setShowCreateMusicModal}
        showModal={showCreateMusicModal}
        storyId={storyId || ""}
        musicName={musicName}
      />
    </div>
  );
}
