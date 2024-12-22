import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCommandSuit from "../../../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../../../hooks/Suit/useUpdateSuitText";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";
import useSearch from "../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import { CharacterValueTypes } from "../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type CommandSuitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandSuitField({ plotFieldCommandId, command, topologyBlockId }: CommandSuitFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Suit");
  const [textValue, setTextValue] = useState("");
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: null,
    characterName: null,
    imgUrl: null,
  });
  const [showCharacterList, setShowCharacterList] = useState(false);
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const { data: commandSuit } = useGetCommandSuit({
    plotFieldCommandId,
  });

  const [commandSuitId, setCommandSuitId] = useState("");

  const { data: character } = useGetCharacterById({
    characterId: commandSuit?.characterId ?? "",
  });
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: commandSuit?.characterId ?? "",
    language: "russian",
  });

  useEffect(() => {
    if (character) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: character?.img || "",
      }));
    }
  }, [character]);

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterValue((prev) => ({
            ...prev,
            characterName: tc?.text || "",
          }));
        }
      });
    }
  }, [translatedCharacter]);

  useEffect(() => {
    if (commandSuit) {
      setCommandSuitId(commandSuit._id);
      setCharacterValue((prev) => ({
        ...prev,
        _id: commandSuit?.characterId || "",
      }));
      setTextValue(commandSuit?.suitName);
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

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateSuitText = useUpdateSuitText({
    characterId: characterValue._id || "",
    suitId: commandSuitId,
    suitName: debouncedValue,
  });

  const onBlur = () => {
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
    updateSuitText.mutate();
  };

  return (
    <div className="flex flex-wrap gap-[.5rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
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
        />
      </form>

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          value={textValue}
          type="text"
          placeholder="Костюм"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
