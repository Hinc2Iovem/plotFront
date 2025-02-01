import useCreateWardrobeAppearanceTypeBlock from "@/features/Editor/PlotField/hooks/Wardrobe/WardrobeAppearancePartBlock/useCreateWardrobeAppearanceTypeBlock";
import StoryAttributesSelectAppearanceType from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesSelectAppearanceType";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { useState } from "react";
import AppearancePartsPromptModal from "../../Prompts/AppearanceParts/AppearancePartsPromptModal";

type WardrobeAppearancePartsFieldTypes = {
  commandWardrobeId: string;
  characterId: string;
};

export default function WardrobeAppearancePartsField({
  commandWardrobeId,
  characterId,
}: WardrobeAppearancePartsFieldTypes) {
  const [appearancePartId, setAppearancePartId] = useState("");

  const [appearanceName, setAppearanceName] = useState("");
  const [appearancePartVariationType, setAppearancePartVariationType] = useState(
    "" as TranslationTextFieldNameAppearancePartsTypes | "temp"
  );
  const [initValue, setInitValue] = useState("");

  const createAppearancePartBlock = useCreateWardrobeAppearanceTypeBlock({
    commandWardrobeId,
  });

  return (
    <div className="w-full flex gap-[5px] sm:flex-row flex-col">
      <StoryAttributesSelectAppearanceType
        currentAppearanceType={appearancePartVariationType}
        filterOrForm="filter"
        setCurrentAppearanceType={setAppearancePartVariationType}
        triggerClasses="capitalize flex-grow md:text-[17px] w-full text-heading relative border-border border-[1px] px-[10px] py-[5px]"
      />
      <div className="w-full relative">
        <AppearancePartsPromptModal
          appearanceType={appearancePartVariationType}
          appearancePartId={appearancePartId}
          currentAppearancePartName={appearanceName}
          initialValue={initValue}
          characterId={characterId}
          setAppearancePartId={setAppearancePartId}
          setCurrentAppearancePartName={setAppearanceName}
          setInitialValue={setInitValue}
          onValueUpdating={({ appearancePartId }) => {
            createAppearancePartBlock.mutate({ appearancePartBodyId: appearancePartId });
            setAppearanceName("");
            setAppearancePartId("");
          }}
          inputClasses="w-full text-text md:text-[17px] border-border border-[1px]"
        />
      </div>
    </div>
  );
}
