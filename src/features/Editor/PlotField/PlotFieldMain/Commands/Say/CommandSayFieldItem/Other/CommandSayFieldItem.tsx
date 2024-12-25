import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useAddItemInsideSearch from "../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetTranslationSay from "../../../../../hooks/Say/useGetTranslationSay";
import SayFieldItemTextArea from "./SayFieldItemTextArea";
import SayFieldItemVariationType from "./SayFieldItemVariationType";

type CommandSayFieldItemTypes = {
  nameValue: string;
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  topologyBlockId: string;
  textStyle: TextStyleTypes;
  textSide: CommandSideTypes;
};

export default function CommandSayFieldItem({
  nameValue,
  plotFieldCommandId,
  plotFieldCommandSayId,
  topologyBlockId,
  textStyle,
  textSide,
}: CommandSayFieldItemTypes) {
  const { episodeId } = useParams();
  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);
  const [currentTextSide, setCurrentTextSide] = useState(textSide);

  const { data: commandSayText } = useGetTranslationSay({
    commandId: plotFieldCommandId,
    language: "russian",
  });

  const [sayVariationType, setSayVariationType] = useState(nameValue);
  const [textValue, setTextValue] = useState("");
  const [initTextValue, setInitTextValue] = useState("");

  useAddItemInsideSearch({
    commandName: nameValue,
    id: plotFieldCommandId,
    text: `${nameValue} ${textValue}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandSayText && !textValue.trim().length) {
      setTextValue((commandSayText.translations || [])[0]?.text || "");
      setInitTextValue((commandSayText.translations || [])[0]?.text || "");
    }
  }, [commandSayText]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <SayFieldItemVariationType
        episodeId={episodeId || ""}
        plotFieldCommandId={plotFieldCommandId}
        plotFieldCommandSayId={plotFieldCommandSayId}
        sayVariationType={sayVariationType}
        setSayVariationType={setSayVariationType}
        textValue={textValue}
      />

      <SayFieldItemTextArea
        currentTextSide={currentTextSide}
        currentTextStyle={currentTextStyle}
        plotFieldCommandSayId={plotFieldCommandSayId}
        episodeId={episodeId || ""}
        plotFieldCommandId={plotFieldCommandId}
        sayVariationType={sayVariationType}
        setCurrentTextSide={setCurrentTextSide}
        setCurrentTextStyle={setCurrentTextStyle}
        setTextValue={setTextValue}
        textValue={textValue}
        initTextValue={initTextValue}
        setInitTextValue={setInitTextValue}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}
