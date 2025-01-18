import { Button } from "@/components/ui/button";
import StoryAttributesSelectAppearanceType from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesSelectAppearanceType";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCreateAppearancePartOptimistic from "../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../types/Additional/TranslationTypes";
import PlotfieldInput from "../../../../../ui/Inputs/PlotfieldInput";
import PreviewImage from "../../../../../ui/shared/PreviewImage";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import { CharacterValueTypes } from "../../../PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { AppearanceCharacterField } from "../MainContent/AppearancePart/EditingAppearancePart";

type NewAppearanceFormTypes = {
  showCreatingNewElement: boolean;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationAppearancePartTypes>>;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewAppearanceForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewAppearanceFormTypes) {
  const { storyId } = useParams();
  const [currentText, setCurrentText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });
  const [currentType, setCurrentType] = useState<TranslationTextFieldNameAppearancePartsTypes | "temp">(
    "" as TranslationTextFieldNameAppearancePartsTypes
  );

  const createAppearance = useCreateAppearancePartOptimistic({
    appearancePartName: currentText,
    storyId: storyId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      console.log("Can not save an empty appearance");
      return;
    }

    const appearancePartId = generateMongoObjectId();
    setNewElement({
      _id: "",
      appearancePartId,
      characterId: characterValue._id || "",
      createdAt: new Date(new Date().getTime()),
      updatedAt: new Date(new Date().getTime()),
      language: "russian",
      translations: [
        {
          _id: "",
          amountOfWords: currentText.length,
          text: currentText,
          textFieldName: currentType as TranslationTextFieldNameAppearancePartsTypes,
        },
      ],
      type: currentType as TranslationTextFieldNameAppearancePartsTypes,
    });

    setShowCreatingNewElement(false);

    createAppearance.mutate({
      type: currentType as TranslationTextFieldNameAppearancePartsTypes,
      characterId: characterValue._id || "",
      currentLanguage: "russian",
      appearancePartId,
      img: typeof imagePreview === "string" ? imagePreview : "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        showCreatingNewElement ? "" : "hidden"
      } flex gap-[10px] flex-col p-[5px] items-center border-border border-[2px] rounded-md ml-[5px]`}
    >
      <div className="flex flex-wrap gap-[5px] flex-col w-full p-[5px] shadow-md rounded-md">
        <div className="relative w-full h-[200px] bg-accent rounded-md">
          <PreviewImage
            imagePreview={imagePreview}
            setPreview={setImagePreview}
            imgClasses="w-full h-[50%] object-contain translate-1/2 absolute top-1/4"
          />
        </div>

        <PlotfieldInput
          ref={inputRef}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="text-[20px] min-w-[200px] flex-grow w-auto"
          placeholder="Внешний вид"
        />

        <AppearanceCharacterField characterValue={characterValue} setCharacterValue={setCharacterValue} />
        <div className="flex-grow flex items-center gap-[10px] p-[5px]">
          <StoryAttributesSelectAppearanceType
            filterOrForm="form"
            currentAppearanceType={currentType}
            setCurrentAppearanceType={setCurrentType}
            defaultTrigger={false}
          />

          <Button className="min-w-[150px] justify-center hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] flex-grow bg-brand-gradient text-white self-end text-[20px] transition-all">
            Изменить
          </Button>
        </div>
      </div>
    </form>
  );
}
