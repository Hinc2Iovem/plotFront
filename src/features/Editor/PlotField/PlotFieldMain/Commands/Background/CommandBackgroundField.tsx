import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandBackground from "../../../hooks/Background/useGetCommandBackground";
import useUpdateBackgroundText from "../../../hooks/Background/useUpdateBackgroundText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import BackgroundMusicForm from "./SubFields/BackgroundMusicForm";
import BackgroundNameAndImage from "./SubFields/BackgroundNameAndImage";
import BackgroundPointOfMovement from "./SubFields/BackgroundPointOfMovement";

type CommandBackgroundFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

export default function CommandBackgroundField({
  plotFieldCommandId,
  topologyBlockId,
  command,
}: CommandBackgroundFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Background");
  const [backgroundName, setBackgroundName] = useState<string>("");
  const [currentMusicName, setCurrentMusicName] = useState("");
  const [pointOfMovement, setPointOfMovement] = useState("");
  const { data: commandBackground } = useGetCommandBackground({
    plotFieldCommandId,
  });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [commandBackgroundId, setCommandBackgroundId] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (commandBackground) {
      setCommandBackgroundId(commandBackground._id);
      setPreview(commandBackground?.imgUrl ?? "");
      setPointOfMovement(commandBackground?.pointOfMovement ?? "");
      setBackgroundName(commandBackground?.backgroundName || "");
    }
  }, [commandBackground]);

  const debouncedNameValue = useDebounce({ delay: 700, value: backgroundName });

  const updateBackgroundText = useUpdateBackgroundText({
    backgroundName,
    pointOfMovement,
    backgroundId: commandBackgroundId,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "background",
    id: plotFieldCommandId,
    text: `${debouncedNameValue} ${currentMusicName} ${pointOfMovement}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandBackground?.backgroundName !== debouncedNameValue && debouncedNameValue?.trim().length) {
      updateBackgroundText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundName]);

  useEffect(() => {
    if (pointOfMovement?.trim().length) {
      if (regexCheckDecimalNumberBetweenZeroAndOne.test(pointOfMovement)) {
        setShowNotificationModal(false);
        updateBackgroundText.mutate();
      } else {
        setShowNotificationModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointOfMovement]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "background",
        id: plotFieldCommandId,
        type: "command",
        value: `${debouncedNameValue} ${currentMusicName} ${pointOfMovement}`,
      });
    }
  }, [currentMusicName, debouncedNameValue, episodeId, pointOfMovement]);

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
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
        showNotificationModal={showNotificationModal}
        setShowNotificationModal={setShowNotificationModal}
        moveValue={pointOfMovement}
        setMoveValue={setPointOfMovement}
      />
    </div>
  );
}
