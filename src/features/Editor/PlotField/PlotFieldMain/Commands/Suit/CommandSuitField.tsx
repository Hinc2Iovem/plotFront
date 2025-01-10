import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandSuit from "../../../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../../../hooks/Suit/useUpdateSuitText";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";

type CommandSuitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandSuitField({ plotFieldCommandId, command, topologyBlockId }: CommandSuitFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Suit");
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const { data: commandSuit } = useGetCommandSuit({
    plotFieldCommandId,
  });

  const [commandSuitId, setCommandSuitId] = useState("");

  const [initCharacterId, steInitCharacterId] = useState("");
  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: commandSuit?.characterId,
  });

  useEffect(() => {
    if (commandSuit) {
      setCommandSuitId(commandSuit._id);
      setCharacterValue((prev) => ({
        ...prev,
        _id: commandSuit?.characterId || "",
      }));
      steInitCharacterId(commandSuit?.characterId || "");
      setTextValue(commandSuit?.suitName);
      setInitTextValue(commandSuit?.suitName);
    }
  }, [commandSuit]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "suit",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  const updateSuitText = useUpdateSuitText({
    characterId: characterValue._id || "",
    suitId: commandSuitId,
    suitName: textValue,
  });

  const updateValues = (characterName?: string) => {
    const character = characterName?.trim().length
      ? characterName
      : typeof characterValue.characterName === "string"
      ? characterValue.characterName
      : "";
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "suit",
        id: plotFieldCommandId,
        type: "command",
        value: `${character} ${textValue}`,
      });
    }
  };
  useEffect(() => {
    if (characterValue._id) {
      updateValues();
    }
  }, [characterValue._id]);

  const onBlurSuitName = () => {
    if (initTextValue !== textValue) {
      updateSuitText.mutate();
      setInitTextValue(textValue);

      updateValues();
    }
  };

  useEffect(() => {
    if (characterValue._id && initCharacterId !== characterValue._id) {
      updateSuitText.mutate();
      steInitCharacterId(characterValue._id);
    }
  }, [characterValue]);

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>

      <PlotfieldCharacterPromptMain
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        characterValue={characterValue}
        onChange={(value) => updateValues(value)}
        plotfieldCommandId={plotFieldCommandId}
        inputClasses="w-full pr-[35px] text-text md:text-[17px]"
        imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
      />

      <form onSubmit={(e) => e.preventDefault()} className="flex-grow">
        <PlotfieldInput
          value={textValue}
          onBlur={onBlurSuitName}
          type="text"
          placeholder="Костюм"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
