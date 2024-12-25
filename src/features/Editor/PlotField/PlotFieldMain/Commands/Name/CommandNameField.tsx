import { useEffect, useRef, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useInitializeCurrentlyFocusedCommandOnReload";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCommandName from "../../../hooks/Name/useGetCommandName";
import useUpdateNameText from "../../../hooks/Name/useUpdateNameText";
import useSearch from "../../../../Context/Search/SearchContext";
import PlotfieldUnknownCharacterPromptMain, {
  ExposedMethodsUnknownCharacter,
  UnknownCharacterValueTypes,
} from "../Prompts/Characters/PlotfieldUnknownCharacterPromptMain";
import { useParams } from "react-router-dom";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";

type CommandNameFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandNameField({ plotFieldCommandId, command, topologyBlockId }: CommandNameFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Name");

  const [initCharacterId, setInitCharacterId] = useState("");
  const [characterValue, setCharacterValue] = useState<UnknownCharacterValueTypes>({
    characterUnknownName: "",
    characterName: "",
    characterImg: "",
    characterId: "",
  });

  const [showCharacterList, setShowCharacterList] = useState(false);
  const { data: commandName } = useGetCommandName({
    plotFieldCommandId,
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
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
    if (character && character.img) {
      setCharacterValue((prev) => ({
        ...prev,
        characterImg: character.img || "",
      }));
    }
  }, [character]);

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        setCharacterValue((prev) => ({
          ...prev,
          characterName: tc.textFieldName === "characterName" ? tc.text : prev.characterName,
          characterUnknownName: tc.textFieldName === "characterUnknownName" ? tc.text : prev.characterUnknownName,
        }));
      });
    }
  }, [translatedCharacter]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "name",
    id: plotFieldCommandId,
    text: `${characterValue.characterUnknownName} ${characterValue.characterName}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandName) {
      setCommandNameId(commandName._id);
      setCharacterValue((prev) => ({
        ...prev,
        characterId: commandName.characterId,
      }));
      setInitCharacterId(commandName.characterId);
    }
  }, [commandName]);

  const currentInput = useRef<ExposedMethodsUnknownCharacter>(null);
  const handleOnBlur = () => {
    if (currentInput.current) {
      currentInput.current.updateCharacterOnBlur();
    }
  };

  const updateNameText = useUpdateNameText({
    nameId: commandNameId,
    plotFieldCommandId,
  });

  useEffect(() => {
    if (initCharacterId !== characterValue.characterId && characterValue.characterId?.trim().length) {
      updateNameText.mutate({
        characterId: characterValue.characterId,
      });
      setInitCharacterId(characterValue.characterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterValue]);

  const characterDebouncedValue = useDebounce({
    value: characterValue.characterUnknownName,
    delay: 500,
  });

  const onBlurUpdateSearchValue = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "name",
        id: plotFieldCommandId,
        type: "command",
        value: `${characterValue.characterUnknownName} ${characterValue.characterName}`,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] relative md:flex-grow-0 flex-grow">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowCharacterList(false);
        }}
        className="flex gap-[.5rem] flex-grow flex-wrap min-w-[42rem] sm:flex-row flex-col"
      >
        <div className="flex-grow min-w-[20rem] sm:w-[calc(50%-2rem)] relative flex gap-[.5rem]">
          <PlotfieldInput
            onClick={(e) => {
              e.stopPropagation();
              setShowCharacterList(true);
            }}
            onBlur={() => {
              handleOnBlur();
              onBlurUpdateSearchValue();
            }}
            value={characterValue.characterUnknownName}
            onChange={(e) => {
              setShowCharacterList(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterUnknownName: e.target.value,
              }));
            }}
            className="pr-[3.5rem]"
            placeholder="Неизвестное Имя"
          />

          <img
            src={characterValue.characterImg}
            alt="CharacterImg"
            className={`${
              characterValue.characterImg?.trim().length ? "" : "hidden"
            } w-[3rem] object-cover rounded-md absolute right-0 top-[1px]`}
          />

          <PlotfieldUnknownCharacterPromptMain
            setShowCharacterModal={setShowCharacterList}
            showCharacterModal={showCharacterList}
            translateAsideValue="translate-y-[3rem]"
            debouncedValue={characterDebouncedValue}
            setCharacterValue={setCharacterValue}
            ref={currentInput}
          />
        </div>
        <div className="flex-grow min-w-[20rem] sm:w-[calc(50%-2rem)] flex gap-[.5rem] relative">
          <p className="text-[1.5rem] w-full bg-secondary text-text-light rounded-md shadow-sm px-[1rem] pr-[3.5rem] py-[.5rem] focus-within:shadow-inner transition-shadow">
            {characterValue.characterName.trim().length ? characterValue.characterName : "Настоящее имя"}
          </p>
          <img
            src={characterValue.characterImg}
            alt="CharacterImg"
            className={`${
              characterValue.characterImg?.trim().length ? "" : "hidden"
            } w-[3rem] object-cover rounded-md absolute right-0 top-[1px]`}
          />
        </div>
      </form>
    </div>
  );
}
