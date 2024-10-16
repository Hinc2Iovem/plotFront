import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetCommandName from "../hooks/Name/useGetCommandName";
import useUpdateNameText from "../hooks/Name/useUpdateNameText";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";

type CommandNameFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandNameField({
  plotFieldCommandId,
  command,
}: CommandNameFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Name");
  const [textValue, setTextValue] = useState("");
  const [currentCharacterId, setCurrentCharacterId] = useState("");
  const [currentCharacterImg, setCurrentCharacterImg] = useState("");
  const [currentCharacterName, setCurrentCharacterName] = useState("");
  const [showCharacterList, setShowCharacterList] = useState(false);
  const theme = localStorage.getItem("theme");
  const { data: commandName } = useGetCommandName({
    plotFieldCommandId,
  });
  const [commandNameId, setCommandNameId] = useState("");

  const { data: character } = useGetCharacterById({
    characterId: commandName?.characterId ?? "",
  });
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: commandName?.characterId ?? "",
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
    if (commandName) {
      setCommandNameId(commandName._id);
      setCurrentCharacterId(commandName?.characterId ?? "");
    }
  }, [commandName]);

  useEffect(() => {
    if (commandName?.name) {
      setTextValue(commandName.name);
    }
  }, [commandName]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateNameText = useUpdateNameText({
    nameId: commandNameId,
    plotFieldCommandId,
  });

  useEffect(() => {
    if (commandName?.name !== debouncedValue && debouncedValue?.trim().length) {
      updateNameText.mutate({ newName: debouncedValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (
      commandName?.characterId !== currentCharacterId &&
      currentCharacterId?.trim().length
    ) {
      updateNameText.mutate({
        characterId: currentCharacterId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCharacterId]);

  const characterDebouncedValue = useDebounce({
    value: currentCharacterName,
    delay: 500,
  });
  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-text-light text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary cursor-default">
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
          className={`flex-grow text-[1.4rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] shadow-md`}
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
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`}
          placeholder="Настоящее имя"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
