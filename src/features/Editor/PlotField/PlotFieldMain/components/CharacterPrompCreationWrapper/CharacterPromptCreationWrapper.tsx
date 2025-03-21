import { useEffect, useState } from "react";
import { toast } from "sonner";
import PlotfieldCharacterPromptMain from "../../Commands/Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import ActionButton from "./ActionButton";

import { Button } from "@/components/ui/button";
import CreateCharacterForm from "./CreateCharacterForm";

type CharacterPromptCreationWrapperTypes = {
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
  creatingCharacterUnknownName?: string;
  initCharacterValue: CharacterValueTypes;
  onBlur: (value: CharacterValueTypes) => void;
  onToastAutoClose?: () => void;
  onToastDismiss?: () => void;
};

export default function CharacterPromptCreationWrapper({
  initCharacterValue,
  onBlur,
  containerClasses,
  creatingCharacterUnknownName,
  imgClasses,
  inputClasses,
  onToastAutoClose,
  onToastDismiss,
}: CharacterPromptCreationWrapperTypes) {
  const [createNewCharacter, setCreateNewCharacter] = useState(false);
  const [startCreatingCharacter, setStartCreatingCharacter] = useState(false);
  const [creatingCharacterName, setCreatingCharacterName] = useState("");

  useEffect(() => {
    if (createNewCharacter) {
      toast("Создать персонажа", {
        className: "flex text-[15px] text-white justify-between items-center",
        action: (
          <ActionButton
            setCreateNewCharacter={setCreateNewCharacter}
            setStartCreatingCharacter={setStartCreatingCharacter}
          />
        ),
        onAutoClose: () => {
          if (onToastAutoClose) {
            onToastAutoClose();
          }
          setCreateNewCharacter(false);
        },
        onDismiss: () => {
          if (onToastDismiss) {
            onToastDismiss();
          }
          setCreateNewCharacter(false);
        },
      });
    }
  }, [createNewCharacter]);

  return (
    <>
      <CreateCharacterForm
        setStartCreatingCharacter={setStartCreatingCharacter}
        startCreatingCharacter={startCreatingCharacter}
        onBlur={onBlur}
        creatingCharacterName={creatingCharacterName}
        creatingCharacterUnknownName={creatingCharacterUnknownName}
      />
      <PlotfieldCharacterPromptMain
        setCreateNewCharacter={setCreateNewCharacter}
        setCreatingCharacterName={setCreatingCharacterName}
        onBlur={onBlur}
        initCharacterValue={initCharacterValue}
        containerClasses={containerClasses}
        imgClasses={imgClasses}
        inputClasses={inputClasses}
      />
      <Button
        className={`${
          creatingCharacterUnknownName ? "" : "hidden"
        } text-text bg-accent hover:opacity-80 transition-all active:scale-[.99]`}
        onClick={() => {
          if (onToastDismiss) {
            onToastDismiss();
          }
        }}
      >
        Закрыть
      </Button>
    </>
  );
}
