import { useEffect, useState } from "react";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useGetCommandSay from "../hooks/Say/useGetCommandSay";
import CommandSayCharacterFieldItem from "./CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import CommandSayFieldItem from "./CommandSayFieldItem/Other/CommandSayFieldItem";

type CommandSayFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  characterId?: string;
  characterName?: string;
  sayType?: CommandSayVariationTypes;
};

export default function CommandSayField({
  plotFieldCommandId,
  topologyBlockId,
  characterId,
  characterName,
  sayType,
}: CommandSayFieldTypes) {
  const { data: commandSay } = useGetCommandSay({ plotFieldCommandId });
  const [commandSayType, setCommandSayType] =
    useState<CommandSayVariationTypes>(
      sayType || ("" as CommandSayVariationTypes)
    );
  const [commandSayId, setCommandSayId] = useState("");
  const [nameValue, setNameValue] = useState(characterName || "");

  useEffect(() => {
    if (commandSay) {
      setCommandSayId(commandSay._id);
      if (!sayType?.length) {
        setCommandSayType(commandSay.type);
      }
    }
  }, [commandSay]);

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: commandSay?.characterId ?? "",
    language: "russian",
  });

  useEffect(() => {
    if (characterName?.trim().length || sayType?.trim().length) {
      return;
    }
    if (commandSayType === "character") {
      if (translatedCharacter) {
        setNameValue(
          translatedCharacter.translations?.find(
            (tc) => tc.textFieldName === "characterName"
          )?.text || ""
        );
      }
    } else if (commandSayType === "author") {
      setNameValue("author");
    } else if (commandSayType === "notify") {
      setNameValue("notify");
    } else if (commandSayType === "hint") {
      setNameValue("hint");
    }
  }, [translatedCharacter, commandSayType, characterName, sayType]);

  return (
    <>
      {sayType ? (
        sayType !== "character" ? (
          <CommandSayFieldItem
            topologyBlockId={topologyBlockId}
            plotFieldCommandId={plotFieldCommandId}
            plotFieldCommandSayId={commandSayId}
            nameValue={sayType}
          />
        ) : (
          <CommandSayCharacterFieldItem
            topologyBlockId={topologyBlockId}
            characterId={characterId || ""}
            plotFieldCommandId={plotFieldCommandId}
            plotFieldCommandSayId={commandSayId}
            characterEmotionId={""}
            nameValue={nameValue}
            setNameValue={setNameValue}
          />
        )
      ) : (
        <>
          {commandSayType !== "character" ? (
            <CommandSayFieldItem
              topologyBlockId={topologyBlockId}
              plotFieldCommandId={plotFieldCommandId}
              plotFieldCommandSayId={commandSayId}
              nameValue={nameValue}
            />
          ) : (
            <CommandSayCharacterFieldItem
              topologyBlockId={topologyBlockId}
              characterId={commandSay?.characterId || ""}
              plotFieldCommandId={plotFieldCommandId}
              plotFieldCommandSayId={commandSayId}
              characterEmotionId={commandSay?.characterEmotionId || ""}
              nameValue={nameValue}
              setNameValue={setNameValue}
            />
          )}
        </>
      )}
    </>
  );
}
