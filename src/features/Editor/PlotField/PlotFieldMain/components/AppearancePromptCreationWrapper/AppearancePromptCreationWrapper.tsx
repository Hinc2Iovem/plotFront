import { toastNotificationStyles } from "@/components/shared/toastStyles";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppearanceActionButton from "./AppearanceActionButton";

import CreateAppearanceForm from "./CreateAppearanceForm";
import AppearancePartsPromptModal from "./AppearancePartsPromptModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type AppearancePromptCreationWrapperTypes = {
  currentAppearancePartName: string;
  appearancePartId: string;
  characterId?: string;
  inputClasses?: string;
  appearanceType?: TranslationTextFieldNameAppearancePartsTypes | "temp";
  setCurrentAppearancePartName: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId: React.Dispatch<React.SetStateAction<string>>;
  onValueUpdating?: ({ appearancePartId }: { appearancePartId: string }) => void;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onBlur?: () => void;
};

export default function AppearancePromptCreationWrapper({
  onBlur,
  inputClasses,
  characterId,
  appearancePartId,
  currentAppearancePartName,
  setAppearancePartId,
  setCurrentAppearancePartName,
  appearanceType,
  onChange,
  onClick,
  onValueUpdating,
}: AppearancePromptCreationWrapperTypes) {
  const [createNewAppearance, setCreateNewAppearance] = useState(false);
  const [startCreatingAppearance, setStartCreatingAppearance] = useState(false);
  const [creatingAppearanceName, setCreatingAppearanceName] = useState("");

  useEffect(() => {
    if (createNewAppearance) {
      toast("Создать внешний вид", {
        ...toastNotificationStyles,
        className: "flex text-[18px] text-white justify-between items-center",
        action: (
          <AppearanceActionButton
            setCreateNewAppearance={setCreateNewAppearance}
            setStartCreatingAppearance={setStartCreatingAppearance}
          />
        ),
        onAutoClose: () => setCreateNewAppearance(false),
        onDismiss: () => setCreateNewAppearance(false),
      });
    }
  }, [createNewAppearance]);

  return (
    <>
      <CreateAppearanceForm
        characterId={characterId || ""}
        setStartCreatingAppearance={setStartCreatingAppearance}
        startCreatingAppearance={startCreatingAppearance}
        onValueUpdating={onValueUpdating}
        creatingAppearanceName={creatingAppearanceName}
      />
      <AppearancePartsPromptModal
        characterId={characterId}
        setCreateNewAppearance={setCreateNewAppearance}
        setCreatingAppearanceName={setCreatingAppearanceName}
        onBlur={onBlur}
        appearancePartId={appearancePartId}
        currentAppearancePartName={currentAppearancePartName}
        setAppearancePartId={setAppearancePartId}
        setCurrentAppearancePartName={setCurrentAppearancePartName}
        appearanceType={appearanceType}
        inputClasses={inputClasses}
        onChange={onChange}
        onClick={onClick}
        onValueUpdating={onValueUpdating}
      />
    </>
  );
}
