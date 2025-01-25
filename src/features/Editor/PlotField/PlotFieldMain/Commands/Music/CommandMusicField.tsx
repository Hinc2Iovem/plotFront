import useAddItemInsideSearch from "@/features/Editor/hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useGetCommandMusic from "../../../hooks/Music/Command/useGetCommandMusic";
import useUpdateCommandMusic from "../../../hooks/Music/Command/useUpdateCommandSound";
import useGetMusicById from "../../../hooks/Music/useGetMusicById";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import "../Prompts/promptStyles.css";
import AllMusicModal, { InitMusicValueTypes } from "./AllMusicModal";

type CommandMusicFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandMusicField({ plotFieldCommandId, topologyBlockId }: CommandMusicFieldTypes) {
  const { episodeId } = useParams();

  const { data: commandMusic } = useGetCommandMusic({
    plotFieldCommandId,
  });

  const { data: music } = useGetMusicById({
    musicId: commandMusic?.musicId || "",
  });

  const { updateValue } = useSearch();

  const [commandMusicId, setCommandMusicId] = useState(commandMusic?._id || "");
  const [initMusicValue, setInitMusicValue] = useState<InitMusicValueTypes>({
    musicId: commandMusic?.musicId || "",
    musicName: music?.musicName || "",
  });

  useAddItemInsideSearch({
    commandName: "music",
    id: plotFieldCommandId,
    text: initMusicValue.musicName,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (music) {
      setInitMusicValue((prev) => ({
        ...prev,
        musicName: music.musicName,
      }));
    }
  }, [music]);

  useEffect(() => {
    if (commandMusic) {
      setInitMusicValue((prev) => ({
        ...prev,
        musicId: commandMusic.musicId,
      }));
      setCommandMusicId(commandMusic._id);
    }
  }, [commandMusic]);

  const updateMusicState = (value: string) => {
    updateValue({
      episodeId: episodeId || "",
      commandName: "music",
      id: plotFieldCommandId,
      type: "command",
      value,
    });
  };

  const updateMusic = useUpdateCommandMusic();

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField nameValue={"music"} plotFieldCommandId={plotFieldCommandId} />

      <div className={`sm:w-[77%] flex-grow flex-col flex-wrap flex items-center gap-[5px] relative`}>
        <AllMusicModal
          initMusicValue={initMusicValue}
          onBlur={(value: InitMusicValueTypes) => {
            updateMusicState(value.musicName);
            updateMusic.mutate({ commandMusicId, musicId: value.musicId });
          }}
        />
      </div>
    </div>
  );
}
