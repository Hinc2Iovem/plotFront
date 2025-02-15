import { toastNotificationStyles } from "@/components/shared/toastStyles";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmotionActionButton from "./EmotionActionButton";

import { EmotionsTypes } from "@/types/StoryData/Character/CharacterTypes";
import { EmotionTypes } from "../../Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import CreateEmotionForm from "./CreateEmotionForm";
import { AllEmotionsModal } from "./AllEmotionsModal";

type EmotionPromptCreationWrapperTypes = {
  emotions: EmotionsTypes[];
  initEmotionValue: EmotionTypes;
  onBlur: (value: EmotionTypes) => void;
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
  characterId: string;
};

export default function EmotionPromptCreationWrapper({
  initEmotionValue,
  onBlur,
  containerClasses,
  imgClasses,
  inputClasses,
  emotions,
  characterId,
}: EmotionPromptCreationWrapperTypes) {
  const [createNewEmotion, setCreateNewEmotion] = useState(false);
  const [startCreatingEmotion, setStartCreatingEmotion] = useState(false);
  const [creatingEmotionName, setCreatingEmotionName] = useState("");

  useEffect(() => {
    if (createNewEmotion) {
      toast("Создать эмоцию", {
        ...toastNotificationStyles,
        className: "flex text-[18px] text-white justify-between items-center",
        action: (
          <EmotionActionButton
            setCreateNewEmotion={setCreateNewEmotion}
            setStartCreatingEmotion={setStartCreatingEmotion}
          />
        ),
        onAutoClose: () => setCreateNewEmotion(false),
        onDismiss: () => setCreateNewEmotion(false),
      });
    }
  }, [createNewEmotion]);

  return (
    <>
      <CreateEmotionForm
        characterId={characterId}
        setStartCreatingEmotion={setStartCreatingEmotion}
        startCreatingEmotion={startCreatingEmotion}
        onBlur={onBlur}
        creatingEmotionName={creatingEmotionName}
      />
      <AllEmotionsModal
        emotions={emotions}
        characterId={characterId}
        setCreateNewEmotion={setCreateNewEmotion}
        setCreatingEmotionName={setCreatingEmotionName}
        onBlur={onBlur}
        initEmotionValue={initEmotionValue}
        containerClasses={containerClasses}
        imgClasses={imgClasses}
        inputClasses={inputClasses}
      />
    </>
  );
}
