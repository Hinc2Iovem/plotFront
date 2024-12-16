import { useRef, useState } from "react";
import PlotfieldTextarea from "../../../../../../../../ui/Textareas/PlotfieldTextarea";
import useUpdateCommandSayText from "../../../../../hooks/Say/useUpdateCommandSayText";
import { checkTextSide, checkTextStyle } from "../../../../../utils/checkTextStyleTextSide";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import TextSettingsModal from "../../../../../../components/TextSettingsModal";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateTextSideStyle from "../shared/useUpdateTextSideStyle";

type SayFieldItemTextAreaTypes = {
  textValue: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  sayVariationType: string;
  episodeId: string;
  plotFieldCommandSayId: string;
  currentTextStyle: TextStyleTypes;
  currentTextSide: CommandSideTypes;

  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTextStyle: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
  setCurrentTextSide: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

export default function SayFieldItemTextArea({
  plotFieldCommandId,
  sayVariationType,
  currentTextSide,
  currentTextStyle,
  textValue,
  topologyBlockId,
  episodeId,
  plotFieldCommandSayId,
  setCurrentTextSide,
  setCurrentTextStyle,
  setTextValue,
}: SayFieldItemTextAreaTypes) {
  const { updateValue } = useSearch();

  const [showTextSettingsModal, setShowTextSettingsModal] = useState(false);

  const currentInput = useRef<HTMLTextAreaElement | null>(null);
  const { updateCommandSide } = usePlotfieldCommands();

  const updateCommandSayText = useUpdateCommandSayText({
    commandId: plotFieldCommandId,
    textValue,
    topologyBlockId,
  });

  useUpdateTextSideStyle({ currentTextSide, currentTextStyle, plotFieldCommandSayId });

  const updateOnBlur = () => {
    if (!currentInput.current) {
      console.log("Not loaded yet");
      return;
    }
    if (episodeId) {
      updateValue({
        episodeId,
        id: plotFieldCommandId,
        type: "command",
        value: `${sayVariationType} ${textValue}`,
        commandName: sayVariationType,
      });
    }
    updateCommandSayText.mutate();
    checkTextStyle({ debouncedValue: textValue, setCurrentTextStyle });
    checkTextSide({
      debouncedValue: textValue,
      setCurrentTextSide,
      plotfieldCommandId: plotFieldCommandId,
      updateCommandSide,
    });
  };

  return (
    <form className="sm:w-[77%] flex-grow w-full relative">
      <PlotfieldTextarea
        value={textValue}
        ref={currentInput}
        placeholder="Such a lovely day"
        onContextMenu={(e) => {
          e.preventDefault();
          setShowTextSettingsModal((prev) => !prev);
        }}
        onBlur={updateOnBlur}
        className={`${
          currentTextStyle === "underscore"
            ? "underline"
            : currentTextStyle === "bold"
            ? "font-bold"
            : currentTextStyle === "italic"
            ? "italic"
            : ""
        } ${currentTextSide === "right" ? "text-right" : "text-left"} `}
        onChange={(e) => setTextValue(e.target.value)}
      />

      <TextSettingsModal
        translateY="translate-y-[-13.5rem] right-0"
        plotfieldCommandId={plotFieldCommandId}
        setShowModal={setShowTextSettingsModal}
        currentTextStyle={currentTextStyle}
        setCurrentTextStyle={setCurrentTextStyle}
        setTextValue={setTextValue}
        showModal={showTextSettingsModal}
        showTextSideRow={false}
        showTextStyleRow={true}
        setCurrentTextSide={setCurrentTextSide}
        currentSide={currentTextSide}
      />
    </form>
  );
}
