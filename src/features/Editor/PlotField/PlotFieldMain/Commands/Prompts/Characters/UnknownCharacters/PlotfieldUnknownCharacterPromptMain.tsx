import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useAddItemInsideSearch from "@/features/Editor/hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandName from "@/features/Editor/PlotField/hooks/Name/useGetCommandName";
import useUpdateNameText from "@/features/Editor/PlotField/hooks/Name/useUpdateNameText";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CharacterPromptCreationWrapper from "../../../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";
import usePrepareCharacterValuesForNameCommand from "../../../Name/hooks/usePrepareCharacterValuesForNameCommand";
import { CharacterValueTypes } from "../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import UnknownNameActionButton from "./UnknownNameActionButton";
import useUnknownCharactersHandleLogic from "./useUnknownCharactersHandleLogic";

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
  const [startAssigningUnknownName, setStartAssigningUnknownName] = useState(false);
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

  const updateCharacterOnBlur = (val?: UnknownCharacterValueTypes) => {
    const value = val?.characterId ? val : characterValue;

    if (!value.characterUnknownName.trim().length) {
      return;
    }

    if (initCharacterUnknownName === value.characterUnknownName && value.characterUnknownName.trim().length) {
      // same character no need to update
      return;
    }

    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) =>
          tct.textFieldName === "characterUnknownName" &&
          tct.text?.toLowerCase() === value.characterUnknownName?.toLowerCase()
      )
    );
    if (!tranlsatedCharacter) {
      toast("Назначить/Создать персонажа", {
        className: "flex text-[15px] text-white justify-between items-center",
        action: <UnknownNameActionButton setStartAssigningUnknownName={setStartAssigningUnknownName} />,
        onAutoClose: () => setStartAssigningUnknownName(false),
        onDismiss: () => setStartAssigningUnknownName(false),
      });
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
            onBlur={() => updateCharacterOnBlur()}
            value={characterValue.characterUnknownName}
            disabled={startAssigningUnknownName}
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

      <RealCharacterName
        startAssigningUnknownName={startAssigningUnknownName}
        characterValue={characterValue}
        commandNameId={commandNameId}
        plotFieldCommandId={plotFieldCommandId}
        setCharacterValue={setCharacterValue}
        setStartAssigningUnknownName={setStartAssigningUnknownName}
      />

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={` flex-grow flex flex-col gap-[5px]`}>
        {filteredCharacters?.length ? (
          filteredCharacters?.map((c, i) => (
            <Button
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                setShowCharacterModal(false);
                if (setCharacterValue) {
                  setCharacterValue({
                    characterId: c.characterId,
                    characterUnknownName: c.characterUnknownName,
                    characterImg: c.characterImg,
                    characterName: c.characterName,
                  });
                }
                updateCharacterOnBlur(c);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              <p className="text-[16px] rounded-md">
                {c.characterUnknownName.length > 20
                  ? c.characterUnknownName.substring(0, 20) + "..."
                  : c.characterUnknownName}
              </p>
              {c.characterImg ? (
                <img src={c.characterImg || ""} alt="CharacterImg" className="w-[30px] rounded-md" />
              ) : null}
            </Button>
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
  startAssigningUnknownName: boolean;
  commandNameId: string;
  plotFieldCommandId: string;
  setCharacterValue: React.Dispatch<React.SetStateAction<UnknownCharacterValueTypes>>;
  setStartAssigningUnknownName: React.Dispatch<React.SetStateAction<boolean>>;
};

function RealCharacterName({
  characterValue,
  startAssigningUnknownName,
  commandNameId,
  plotFieldCommandId,
  setCharacterValue,
  setStartAssigningUnknownName,
}: RealCharacterNameTypes) {
  const [initCharacterValue, setInitCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });

  const updateNameText = useUpdateNameText({
    nameId: commandNameId,
    plotFieldCommandId,
  });

  const handleOnBlur = (value: CharacterValueTypes) => {
    setInitCharacterValue(value);
    setCharacterValue((prev) => ({
      characterId: value._id || "",
      characterName: value.characterName || "",
      characterUnknownName: prev.characterUnknownName,
      characterImg: value.imgUrl || "",
    }));

    setStartAssigningUnknownName(false);
    updateNameText.mutate({
      characterId: value._id || "",
    });
  };

  const onToastClose = () => {
    setStartAssigningUnknownName(false);
  };

  return (
    <div className="flex-grow min-w-[150px] h-[36.5px] bg-secondary items-center flex gap-[.5rem] border-border rounded-md border-[1px] relative">
      {startAssigningUnknownName ? (
        <CharacterPromptCreationWrapper
          initCharacterValue={initCharacterValue}
          creatingCharacterUnknownName={characterValue.characterUnknownName}
          onBlur={handleOnBlur}
          onToastAutoClose={onToastClose}
          onToastDismiss={onToastClose}
          imgClasses="h-full right-0 absolute top-[0px] right-[3px]"
          containerClasses="h-[36.5px] w-full border-none relative"
          inputClasses="w-full h-full pr-[35px]"
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default PlotfieldUnknownCharacterPromptMain;
