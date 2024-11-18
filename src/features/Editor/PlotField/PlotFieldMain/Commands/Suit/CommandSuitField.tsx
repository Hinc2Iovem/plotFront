import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetCommandSuit from "../../../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../../../hooks/Suit/useUpdateSuitText";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";

type CommandSuitFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandSuitField({ plotFieldCommandId, command }: CommandSuitFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Suit");
  const [textValue, setTextValue] = useState("");
  const [currentCharacterId, setCurrentCharacterId] = useState("");
  const [currentCharacterImg, setCurrentCharacterImg] = useState("");
  const [currentCharacterName, setCurrentCharacterName] = useState("");
  const [showCharacterList, setShowCharacterList] = useState(false);
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const { data: commandSuit } = useGetCommandSuit({
    plotFieldCommandId,
  });
  const [focusedSecondTimeFirst, setFocusedSecondTimeFirst] = useState(false);
  const [focusedSecondTimeSecond, setFocusedSecondTimeSecond] = useState(false);

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
      setCurrentCharacterImg(character?.img as string);
    }
  }, [character]);

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCurrentCharacterName(tc.text ?? "");
        }
      });
    }
  }, [translatedCharacter]);

  useEffect(() => {
    if (commandSuit) {
      setCommandSuitId(commandSuit._id);
      setCurrentCharacterId(commandSuit?.characterId ?? "");
    }
  }, [commandSuit]);

  useEffect(() => {
    if (commandSuit?.suitName) {
      setTextValue(commandSuit.suitName);
    }
  }, [commandSuit]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateSuitText = useUpdateSuitText({
    characterId: currentCharacterId,
    suitId: commandSuitId,
    suitName: debouncedValue,
  });

  useEffect(() => {
    if (debouncedValue?.trim().length || currentCharacterImg?.trim().length) {
      updateSuitText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, currentCharacterImg]);

  const characterDebouncedValue = useDebounce({
    value: currentCharacterName,
    delay: 500,
  });
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
          focusedSecondTime={focusedSecondTimeFirst}
          setFocusedSecondTime={setFocusedSecondTimeFirst}
          onClick={(e) => {
            e.stopPropagation();
            setShowCharacterList(true);
          }}
          value={currentCharacterName}
          onChange={(e) => {
            setShowCharacterList(true);
            setCurrentCharacterName(e.target.value);
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={currentCharacterImg}
          alt="CharacterImg"
          className={`${currentCharacterImg?.trim().length ? "" : "hidden"} w-[3rem] object-cover rounded-md self-end`}
        />
        <PlotfieldCharacterPromptMain
          debouncedValue={characterDebouncedValue}
          characterValue={currentCharacterName}
          translateAsideValue="translate-y-[3.5rem]"
          setCharacterId={setCurrentCharacterId}
          setCharacterName={setCurrentCharacterName}
          setShowCharacterModal={setShowCharacterList}
          showCharacterModal={showCharacterList}
          setCharacterImg={setCurrentCharacterImg}
          commandIfId=""
          isElse={false}
        />
      </form>

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          focusedSecondTime={focusedSecondTimeSecond}
          setFocusedSecondTime={setFocusedSecondTimeSecond}
          value={textValue}
          type="text"
          placeholder="Костюм"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
