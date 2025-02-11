import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandBackground from "../../../hooks/Background/useGetCommandBackground";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import BackgroundMusicForm from "./SubFields/BackgroundMusicForm";
import BackgroundNameAndImage from "./SubFields/BackgroundNameAndImage";
import BackgroundPointOfMovement from "./SubFields/BackgroundPointOfMovement";

type CommandBackgroundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandBackgroundField({ plotFieldCommandId, topologyBlockId }: CommandBackgroundFieldTypes) {
  const { episodeId } = useParams();
  const [backgroundName, setBackgroundName] = useState<string>("");
  const [currentMusicName, setCurrentMusicName] = useState("");
  const [pointOfMovement, setPointOfMovement] = useState("");
  const { data: commandBackground } = useGetCommandBackground({
    plotFieldCommandId,
  });

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [commandBackgroundId, setCommandBackgroundId] = useState("");

  useEffect(() => {
    if (commandBackground) {
      setCommandBackgroundId(commandBackground._id);
      setPreview(commandBackground?.imgUrl ?? "");
      setPointOfMovement(commandBackground?.pointOfMovement ?? "");
      setBackgroundName(commandBackground?.backgroundName || "");
    }
  }, [commandBackground]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "background",
    id: plotFieldCommandId,
    text: `${backgroundName} ${currentMusicName} ${pointOfMovement}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "background",
        id: plotFieldCommandId,
        type: "command",
        value: `${backgroundName} ${currentMusicName} ${pointOfMovement}`,
      });
    }
  }, [currentMusicName, backgroundName, episodeId, pointOfMovement]);

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"background"}
        plotFieldCommandId={plotFieldCommandId}
      />

      <BackgroundNameAndImage
        backgroundName={backgroundName}
        commandBackgroundId={commandBackgroundId}
        imagePreview={imagePreview}
        setBackgroundName={setBackgroundName}
        setPreview={setPreview}
      />
      <BackgroundMusicForm
        backgroundId={commandBackgroundId}
        musicId={commandBackground?.musicId ?? ""}
        setCurrentMusicName={setCurrentMusicName}
      />
      <BackgroundPointOfMovement
        moveValue={pointOfMovement}
        setMoveValue={setPointOfMovement}
        commandBackgroundId={commandBackgroundId}
      />
    </div>
  );
}
