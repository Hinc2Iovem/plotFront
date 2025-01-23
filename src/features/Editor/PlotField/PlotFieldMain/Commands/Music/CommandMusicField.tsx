import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandMusic from "../../../hooks/Music/Command/useGetCommandMusic";
import useGetMusicById from "../../../hooks/Music/useGetMusicById";
import "../Prompts/promptStyles.css";
import AllMusicModal from "./AllMusicModal";

type CommandMusicFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandMusicField({ plotFieldCommandId, command, topologyBlockId }: CommandMusicFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Music");
  const [initValue, setInitValue] = useState<string>("");
  const [musicName, setMusicName] = useState<string>("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

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
      setMusicName(music.musicName || "");
      setInitValue(music.musicName || "");
    }
  }, [music]);

  const updateMusicState = (value: string) => {
    updateValue({
      episodeId: episodeId || "",
      commandName: "music",
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
        <AllMusicModal
          musicName={musicName}
          setMusicName={setMusicName}
          commandMusicId={commandMusicId}
          storyId={storyId || ""}
          initValue={initValue}
          onChange={(value) => updateMusicState(value)}
          setInitValue={setInitValue}
        />
      </div>
    </div>
  );
}
