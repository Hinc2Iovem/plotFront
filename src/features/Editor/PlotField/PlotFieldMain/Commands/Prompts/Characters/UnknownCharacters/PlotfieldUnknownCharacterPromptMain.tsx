import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useGetCommandName from "@/features/Editor/PlotField/hooks/Name/useGetCommandName";
import useUpdateNameText from "@/features/Editor/PlotField/hooks/Name/useUpdateNameText";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useRef, useState } from "react";
import usePrepareCharacterValuesForNameCommand from "../../../Name/hooks/usePrepareCharacterValuesForNameCommand";
import PlotfieldUnknownCharactersPrompt from "./PlotfieldUnknownCharactersPrompt";
import useUnknownCharactersHandleLogic from "./useUnknownCharactersHandleLogic";
import useAddItemInsideSearch from "@/features/Editor/hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";

export type UnknownCharacterValueTypes = {
  characterUnknownName: string;
  characterImg?: string;
  characterId: string;
  characterName: string;
};

type PlotfieldUnknownCharacterPromptMainTypes = {
  onBlur: (value: UnknownCharacterValueTypes) => void;
  plotFieldCommandId: string;
  topologyBlockId: string;
};

const PlotfieldUnknownCharacterPromptMain = ({
  onBlur,
  plotFieldCommandId,
  topologyBlockId,
}: PlotfieldUnknownCharacterPromptMainTypes) => {
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: commandName } = useGetCommandName({
    plotFieldCommandId,
  });

  const [commandNameId, setCommandNameId] = useState("");
  const [initCharacterUnknownName, setInitCharacterUnknownName] = useState("");

  const { characterValue, setCharacterValue } = usePrepareCharacterValuesForNameCommand({
    characterId: commandName?.characterId || "",
  });

  useAddItemInsideSearch({
    commandName: "name",
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
    }
  }, [commandName]);

  const { filteredCharacters, allTranslatedCharacters, allCharacters } = useUnknownCharactersHandleLogic({
    characterUnknownName: characterValue.characterUnknownName,
  });

  const updateNameText = useUpdateNameText({
    nameId: commandNameId,
    plotFieldCommandId,
  });

  const updateCharacterOnBlur = () => {
    if (
      initCharacterUnknownName === characterValue.characterUnknownName &&
      characterValue.characterUnknownName.trim().length
    ) {
      // same character no need to update
      return;
    }

    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) =>
          tct.textFieldName === "characterUnknownName" &&
          tct.text?.toLowerCase() === characterValue.characterUnknownName?.toLowerCase()
      )
    );
    if (!tranlsatedCharacter) {
      console.log("Non-existing character");
      return;
    }

    const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

    const characterObj = {
      characterId: character?._id || "",
      characterUnknownName:
        tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterUnknownName")?.text || "",
      characterImg: character?.img || "",
      characterName: tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
    };

    updateNameText.mutate({
      characterId: characterObj.characterId,
    });

    setInitCharacterUnknownName(characterObj.characterUnknownName);
    onBlur(characterObj);
    setCharacterValue(characterObj);
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: filteredCharacters.length });

  return (
    <Popover open={showCharacterModal} onOpenChange={setShowCharacterModal}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex-grow flex justify-between items-center relative"
        >
          <PlotfieldInput
            ref={currentInput}
            onBlur={updateCharacterOnBlur}
            value={characterValue.characterUnknownName}
            onChange={(e) => {
              setShowCharacterModal(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterUnknownName: e.target.value,
              }));
            }}
            className={`w-full pr-[35px] text-text md:text-[17px]`}
            placeholder="Неизвестное Имя"
          />

          <img
            src={characterValue.characterImg}
            alt="CharacterImg"
            className={`${
              characterValue.characterImg?.trim().length ? "" : "hidden"
            } w-[30px] object-cover rounded-md right-0 absolute`}
          />
        </form>
      </PopoverTrigger>

      <RealCharacterName characterValue={characterValue} />

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={` flex-grow flex flex-col gap-[5px]`}>
        {filteredCharacters?.length ? (
          filteredCharacters?.map((c, i) => (
            <PlotfieldUnknownCharactersPrompt
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              setShowCharacterModal={setShowCharacterModal}
              setCharacterValue={setCharacterValue}
              {...c}
            />
          ))
        ) : !filteredCharacters?.length ? (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

type RealCharacterNameTypes = {
  characterValue: UnknownCharacterValueTypes;
};

function RealCharacterName({ characterValue }: RealCharacterNameTypes) {
  return (
    <div className="flex-grow min-w-[150px] min-h-[36.5px] bg-secondary items-center flex gap-[.5rem] border-border rounded-md border-[1px] relative">
      <p className="text-[17px] text-text rounded-md px-[10px] pr-[5px]">
        {characterValue.characterName.trim().length ? characterValue.characterName : "Настоящее имя"}
      </p>
      <img
        src={characterValue.characterImg}
        alt="CharacterImg"
        className={`${
          characterValue.characterImg?.trim().length ? "" : "hidden"
        } w-[30px] object-cover rounded-md absolute right-0`}
      />
    </div>
  );
}

export default PlotfieldUnknownCharacterPromptMain;
