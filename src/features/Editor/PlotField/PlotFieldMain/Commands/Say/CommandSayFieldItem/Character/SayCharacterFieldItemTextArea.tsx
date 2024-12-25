import { useRef, useState } from "react";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import PlotfieldTextarea from "../../../../../../../../ui/Textareas/PlotfieldTextarea";
import TextSettingsModal from "../../../../../../components/TextSettingsModal";
import useSearch from "../../../../../../Context/Search/SearchContext";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateCommandSayText from "../../../../../hooks/Say/useUpdateCommandSayText";
import { checkTextSide, checkTextStyle } from "../../../../../utils/checkTextStyleTextSide";
import useUpdateTextSideStyle from "../shared/useUpdateTextSideStyle";

type SayCharacterFieldItemTextAreaTypes = {
  textValue: string;
  initTextValue: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  episodeId: string;
  currentTextStyle: TextStyleTypes;
  currentTextSide: CommandSideTypes;
  emotionName: string;
  characterName: string;
  plotFieldCommandSayId: string;

  setInitTextValue: React.Dispatch<React.SetStateAction<string>>;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTextStyle: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
  setCurrentTextSide: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

export default function SayCharacterFieldItemTextArea({
  textValue,
  setTextValue,
  currentTextSide,
  currentTextStyle,
  episodeId,
  plotFieldCommandSayId,
  plotFieldCommandId,
  setCurrentTextSide,
  setCurrentTextStyle,
  topologyBlockId,
  characterName,
  emotionName,
  initTextValue,
  setInitTextValue,
}: SayCharacterFieldItemTextAreaTypes) {
  const { updateCommandSide } = usePlotfieldCommands();
  const { updateValue } = useSearch();

  const [showTextSettingsModal, setShowTextSettingsModal] = useState(false);
  const currentInput = useRef<HTMLTextAreaElement | null>(null);

  const updateCommandSayText = useUpdateCommandSayText({
    commandId: plotFieldCommandId,
    textValue,
    topologyBlockId,
  });

  const onBlur = () => {
    if (textValue?.trim().length && initTextValue !== textValue) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "character",
          id: plotFieldCommandId,
          type: "command",
          value: `${characterName} ${emotionName} ${textValue}`,
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

      setInitTextValue(textValue);
    }
  };

  useUpdateTextSideStyle({ currentTextSide, currentTextStyle, plotFieldCommandSayId });

  return (
    <form className="sm:w-[57%] flex-grow w-full h-full relative">
      <PlotfieldTextarea
        value={textValue}
        ref={currentInput}
        placeholder="Such a lovely day"
        onBlur={onBlur}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowTextSettingsModal((prev) => !prev);
        }}
        className={`${
          currentTextStyle === "underscore"
            ? "underline"
            : currentTextStyle === "bold"
            ? "font-bold"
            : currentTextStyle === "italic"
            ? "italic"
            : ""
        } ${currentTextSide === "right" ? "text-right" : "text-left"} h-full min-h-[7.5rem]`}
        onChange={(e) => setTextValue(e.target.value)}
      />

      <TextSettingsModal
        translateY="translate-y-[-15rem]"
        setShowModal={setShowTextSettingsModal}
        currentTextStyle={currentTextStyle}
        setCurrentTextStyle={setCurrentTextStyle}
        showModal={showTextSettingsModal}
        showTextSideRow={true}
        showTextStyleRow={true}
        setTextValue={setTextValue}
        plotfieldCommandId={plotFieldCommandId}
        setCurrentTextSide={setCurrentTextSide}
        currentSide={currentTextSide}
      />
    </form>
  );
}
