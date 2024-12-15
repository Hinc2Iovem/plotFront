import { useEffect, useState } from "react";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useGetCommandSay from "../../../hooks/Say/useGetCommandSay";
import CommandSayCharacterFieldItem from "./CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import CommandSayFieldItem from "./CommandSayFieldItem/Other/CommandSayFieldItem";

type CommandSayFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  characterId?: string;
  characterName?: string;
  emotionName?: string;
  emotionId?: string;
  emotionImg?: string;
  characterImg?: string;
  sayType?: CommandSayVariationTypes;
  isElse?: boolean;
  commandSide?: "right" | "left";
};

export default function CommandSayField({
  plotFieldCommandId,
  topologyBlockId,
  characterId,
  characterName,
  emotionName,
  emotionId,
  emotionImg,
  characterImg,
  sayType,
  commandSide,
}: CommandSayFieldTypes) {
  const { data: commandSay } = useGetCommandSay({ plotFieldCommandId });
  const [commandSayType, setCommandSayType] = useState<CommandSayVariationTypes>(
    sayType || ("" as CommandSayVariationTypes)
  );
  const [commandSayId, setCommandSayId] = useState("");
  const [nameValue, setNameValue] = useState(characterName || "");

  const { updateSayType, updateCharacterProperties, updateCommandSide, updateEmotionProperties } =
    usePlotfieldCommands();

  useEffect(() => {
    if (commandSay) {
      setCommandSayId(commandSay._id);
      if (!sayType?.length) {
        setCommandSayType(commandSay.type);
      }
      updateCommandSide({
        commandSide: commandSay?.commandSide || "right",
        id: plotFieldCommandId,
      });
    }
  }, [commandSay]);

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: characterId || commandSay?.characterId || "",
    language: "russian",
  });

  useEffect(() => {
    if (sayType === "character" || commandSayType === "character") {
      if (translatedCharacter) {
        const currentCharacter =
          translatedCharacter.translations?.find((tc) => tc.textFieldName === "characterName")?.text || "";
        setNameValue(currentCharacter);

        updateCharacterProperties({
          id: plotFieldCommandId,
          characterId: characterId || commandSay?.characterId || "",
          characterName: currentCharacter,
          characterImg: "",
        });
        updateEmotionProperties({
          emotionId: emotionId || commandSay?.characterEmotionId || "",
          emotionName: "",
          id: plotFieldCommandId,
          emotionImg: "",
        });
      }
      updateSayType({ id: plotFieldCommandId, sayType: "character" });
    } else if (sayType === "author" || commandSayType === "author") {
      setNameValue("author");
      updateSayType({ id: plotFieldCommandId, sayType: "author" });
    } else if (sayType === "notify" || commandSayType === "notify") {
      setNameValue("notify");
      updateSayType({ id: plotFieldCommandId, sayType: "notify" });
    } else if (sayType === "hint" || commandSayType === "hint") {
      setNameValue("hint");
      updateSayType({ id: plotFieldCommandId, sayType: "hint" });
    }
  }, [translatedCharacter, commandSayType, characterName, sayType, commandSay]);

  return (
    <>
      {sayType !== "character" ? (
        <CommandSayFieldItem
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={plotFieldCommandId}
          textSide={commandSide || commandSay?.commandSide || "right"}
          textStyle={commandSay?.textStyle || "default"}
          plotFieldCommandSayId={commandSayId}
          nameValue={sayType || nameValue}
        />
      ) : (
        <CommandSayCharacterFieldItem
          currentCharacterId={characterId || commandSay?.characterId || ""}
          currentEmotionId={emotionId || commandSay?.characterEmotionId || ""}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={plotFieldCommandId}
          characterName={characterName || nameValue}
          plotFieldCommandSayId={commandSayId}
          textSide={commandSide || commandSay?.commandSide || "right"}
          textStyle={commandSay?.textStyle || "default"}
          characterImg={characterImg || ""}
          emotionName={emotionName || ""}
          emotionImg={emotionImg || ""}
        />
      )}
    </>
  );
}
