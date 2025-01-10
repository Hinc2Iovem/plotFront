import { useRef } from "react";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useSearch from "../../../../../../Context/Search/SearchContext";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateCommandSayText from "../../../../../hooks/Say/useUpdateCommandSayText";
import { checkTextSide, checkTextStyle } from "../../../../../utils/checkTextStyleTextSide";
import TextAreaWithContextMenu from "../shared/TextAreaWithContextMenu";
import useUpdateTextSideStyle from "../shared/useUpdateTextSideStyle";

type SayFieldItemTextAreaTypes = {
  textValue: string;
  initTextValue: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  sayVariationType: string;
  episodeId: string;
  plotFieldCommandSayId: string;
  currentTextStyle: TextStyleTypes;
  currentTextSide: CommandSideTypes;

  setInitTextValue: React.Dispatch<React.SetStateAction<string>>;
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
  initTextValue,
  topologyBlockId,
  episodeId,
  plotFieldCommandSayId,
  setCurrentTextSide,
  setCurrentTextStyle,
  setTextValue,
  setInitTextValue,
}: SayFieldItemTextAreaTypes) {
  const { updateValue } = useSearch();

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

    if (textValue === initTextValue) {
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

    setInitTextValue(textValue);
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
    <TextAreaWithContextMenu
      currentTextSide={currentTextSide}
      textValue={textValue}
      updateOnBlur={updateOnBlur}
      ref={currentInput}
      plotfieldCommandId={plotFieldCommandId}
      currentTextStyle={currentTextStyle}
      setCurrentTextStyle={setCurrentTextStyle}
      setTextValue={setTextValue}
      showTextSideRow={false}
      showTextStyleRow={true}
      setCurrentTextSide={setCurrentTextSide}
      currentSide={currentTextSide}
    />
  );
}
