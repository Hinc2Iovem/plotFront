import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetCommandSuit from "../hooks/Suit/useGetCommandSuit";
import useUpdateSuitText from "../hooks/Suit/useUpdateSuitText";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";

type CommandSuitFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandSuitField({
  plotFieldCommandId,
  command,
}: CommandSuitFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Suit");
  const [textValue, setTextValue] = useState("");
  const [currentCharacterId, setCurrentCharacterId] = useState("");
  const [currentCharacterImg, setCurrentCharacterImg] = useState("");
  const [currentCharacterName, setCurrentCharacterName] = useState("");
  const [showCharacterList, setShowCharacterList] = useState(false);

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
    <div className="flex flex-wrap gap-[.5rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
          {nameValue}
        </h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowCharacterList(false);
        }}
        className="w-full relative flex gap-[.5rem] items-center"
      >
        <input
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
          className="flex-grow text-[1.4rem] outline-gray-300 bg-white rounded-md px-[1rem] py-[.5rem] shadow-md"
        />

        <img
          src={currentCharacterImg}
          alt="CharacterImg"
          className={`${
            currentCharacterImg?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover rounded-md self-end`}
        />
        <PlotfieldCharacterPromptMain
          characterDebouncedValue={characterDebouncedValue}
          setCharacterId={setCurrentCharacterId}
          setCharacterName={setCurrentCharacterName}
          setShowCharacterModal={setShowCharacterList}
          showCharacterModal={showCharacterList}
          setCharacterImg={setCurrentCharacterImg}
        />
      </form>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <input
          value={textValue}
          type="text"
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Костюм"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
