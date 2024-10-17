import { useEffect, useState } from "react";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetCommandBackground from "../hooks/Background/useGetCommandBackground";
import useUpdateBackgroundText from "../hooks/Background/useUpdateBackgroundText";
import BackgroundMusicForm from "./BackgroundMusicForm";
import BackgroundNameAndImage from "./BackgroundNameAndImage";
import BackgroundPointOfMovement from "./BackgroundPointOfMovement";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";

type CommandBackgroundFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

export default function CommandBackgroundField({
  plotFieldCommandId,
  command,
}: CommandBackgroundFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Background");
  const [backgroundName, setBackgroundName] = useState<string>("");
  const [pointOfMovement, setPointOfMovement] = useState("");
  const { data: commandBackground } = useGetCommandBackground({
    plotFieldCommandId,
  });
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [commandBackgroundId, setCommandBackgroundId] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (commandBackground) {
      setCommandBackgroundId(commandBackground._id);
      setPreview(commandBackground?.imgUrl ?? "");
      setPointOfMovement(commandBackground?.pointOfMovement ?? "");
    }
  }, [commandBackground]);

  useEffect(() => {
    if (commandBackground?.backgroundName) {
      setBackgroundName(commandBackground.backgroundName);
    }
  }, [commandBackground]);

  const debouncedNameValue = useDebounce({ delay: 700, value: backgroundName });

  const updateBackgroundText = useUpdateBackgroundText({
    backgroundName,
    pointOfMovement,
    backgroundId: commandBackgroundId,
  });

  useEffect(() => {
    if (
      commandBackground?.backgroundName !== debouncedNameValue &&
      debouncedNameValue?.trim().length
    ) {
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

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField>{nameValue}</PlotfieldCommandNameField>
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
