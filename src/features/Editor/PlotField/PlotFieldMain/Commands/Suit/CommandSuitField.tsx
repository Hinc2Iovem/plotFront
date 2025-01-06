import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandSuit from "../../../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../../../hooks/Suit/useUpdateSuitText";
import PlotfieldCharacterPromptMain, { ExposedMethods } from "../Prompts/Characters/PlotfieldCharacterPromptMain";

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

  const [showCharacterList, setShowCharacterList] = useState(false);
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

  const inputRef = useRef<ExposedMethods>(null);
  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateSuitText = useUpdateSuitText({
    characterId: characterValue._id || "",
    suitId: commandSuitId,
    suitName: debouncedValue,
  });

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "suit",
        id: plotFieldCommandId,
        type: "command",
        value: `${
          typeof characterValue.characterName === "string" ? characterValue.characterName : ""
        } ${debouncedValue}`,
      });
    }
  };

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }

    updateValues();
  };

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
    <div className="flex flex-wrap gap-[.5rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused
              ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
              : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowCharacterList(false);
        }}
        className="w-full relative flex gap-[.5rem]"
      >
        <PlotfieldInput
          onClick={(e) => {
            e.stopPropagation();
            setShowCharacterList(true);
          }}
          onBlur={onBlur}
          value={characterValue.characterName || ""}
          onChange={(e) => {
            setShowCharacterList(true);
            setCharacterValue((prev) => ({
              ...prev,
              characterName: e.target.value,
            }));
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={characterValue?.imgUrl || ""}
          alt="CharacterImg"
          className={`${
            characterValue?.imgUrl?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover rounded-md self-end`}
        />
        <PlotfieldCharacterPromptMain
          characterName={characterValue.characterName || ""}
          translateAsideValue="translate-y-[3.5rem]"
          setShowCharacterModal={setShowCharacterList}
          showCharacterModal={showCharacterList}
          currentCharacterId={characterValue._id || ""}
          setCharacterValue={setCharacterValue}
          ref={inputRef}
        />
      </form>

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
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
