import { useEffect, useState } from "react";
import PlotfieldCharacterPromptMain from "../../Commands/Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { toast } from "sonner";
import { toastNotificationStyles } from "@/components/shared/toastStyles";
import ActionButton from "./ActionButton";

import CreateCharacterForm from "./CreateCharacterForm";

type CharacterPromptCreationWrapperTypes = {
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
  initCharacterValue: CharacterValueTypes;
  onBlur: (value: CharacterValueTypes) => void;
};

export default function CharacterPromptCreationWrapper({
  initCharacterValue,
  onBlur,
  containerClasses,
  imgClasses,
  inputClasses,
}: CharacterPromptCreationWrapperTypes) {
  const [createNewCharacter, setCreateNewCharacter] = useState(false);
  const [startCreatingCharacter, setStartCreatingCharacter] = useState(false);
  const [creatingCharacterName, setCreatingCharacterName] = useState("");
  useEffect(() => {
    if (createNewCharacter) {
      toast("Создать персонажа", {
        ...toastNotificationStyles,
        className: "flex text-[18px] text-white justify-between items-center",
        action: (
          <ActionButton
            setCreateNewCharacter={setCreateNewCharacter}
            setStartCreatingCharacter={setStartCreatingCharacter}
          />
        ),
        onAutoClose: () => setCreateNewCharacter(false),
        onDismiss: () => setCreateNewCharacter(false),
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
    </>
  );
}
