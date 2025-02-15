import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useGetCommandSuit from "../../../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../../../hooks/Suit/useUpdateSuitText";
import CharacterPromptCreationWrapper from "../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandSuitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandSuitField({ plotFieldCommandId, topologyBlockId }: CommandSuitFieldTypes) {
  const { episodeId } = useParams();
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const { data: commandSuit } = useGetCommandSuit({
    plotFieldCommandId,
  });

  const [commandSuitId, setCommandSuitId] = useState("");

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
      setTextValue(commandSuit?.suitName);
      setInitTextValue(commandSuit?.suitName);
    }
  }, [commandSuit]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "suit",
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

  const onBlurSuitName = () => {
    if (initTextValue !== textValue) {
      updateSuitText.mutate();
      setInitTextValue(textValue);

      updateValues();
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"suit"}
        plotFieldCommandId={plotFieldCommandId}
      />

      <CharacterPromptCreationWrapper
        initCharacterValue={characterValue}
        onBlur={(value) => {
          setCharacterValue(value);
          updateValues(value.characterName || "");
          updateSuitText.mutate();
        }}
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
