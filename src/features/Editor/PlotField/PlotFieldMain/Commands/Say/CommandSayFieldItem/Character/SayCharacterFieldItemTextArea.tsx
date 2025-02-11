import { useRef } from "react";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useSearch from "../../../../../../Context/Search/SearchContext";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateCommandSayText from "../../../../../hooks/Say/patch/useUpdateCommandSayText";
import { checkTextSide, checkTextStyle } from "../../../../../utils/checkTextStyleTextSide";
import TextAreaWithContextMenu from "../shared/TextAreaWithContextMenu";
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
    <TextAreaWithContextMenu
      currentTextSide={currentTextSide}
      textValue={textValue}
      updateOnBlur={onBlur}
      ref={currentInput}
      currentTextStyle={currentTextStyle}
      setCurrentTextStyle={setCurrentTextStyle}
      showTextSideRow={true}
      showTextStyleRow={true}
      setTextValue={setTextValue}
      plotfieldCommandId={plotFieldCommandId}
      setCurrentTextSide={setCurrentTextSide}
      currentSide={currentTextSide}
    />
  );
}
