import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AllAppearancePartRusVariations, appearancePartColors } from "../../../../../const/APPEARACE_PARTS";
import useCreateAppearancePartOptimistic from "../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../types/Additional/TranslationTypes";
import { AppearancePartVariationRusTypes } from "../../../../../types/StoryData/AppearancePart/AppearancePartTypes";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import AsideScrollable from "../../../../shared/Aside/AsideScrollable/AsideScrollable";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../shared/Inputs/PlotfieldInput";
import PreviewImage from "../../../../shared/utilities/PreviewImage";
import { AppearanceAsideButton, AppearanceCharacterField } from "../MainContent/AppearancePart/EditingAppearancePart";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentText, setCurrentText] = useState("");
  const [showAllTypes, setShowAllTypes] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  const [typeToRus, setTypeToRus] = useState<AppearancePartVariationRusTypes>("" as AppearancePartVariationRusTypes);

  const [currentCharacter, setCurrentCharacter] = useState({
    characterId: "",
    characterName: "",
    characterImg: "",
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
      characterId: currentCharacter.characterId,
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
      characterId: currentCharacter.characterId,
      currentLanguage: "russian",
      appearancePartId,
      img: typeof imagePreview === "string" ? imagePreview : "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${showCreatingNewElement ? "" : "hidden"} flex gap-[1rem] flex-col p-[.5rem] items-center`}
    >
      <div className="flex flex-wrap gap-[.5rem] flex-col w-[40rem] p-[.5rem] shadow-md rounded-md bg-primary-darker">
        <div className="relative w-full h-[20rem] bg-secondary rounded-md">
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
          className="text-[2rem] min-w-[20rem] flex-grow w-auto"
          placeholder="Внешний вид"
        />

        <AppearanceCharacterField
          characterId={currentCharacter.characterId || ""}
          characterName={currentCharacter.characterName || ""}
          characterImg={currentCharacter.characterImg || ""}
          setCurrentCharacter={
            setCurrentCharacter as React.Dispatch<
              React.SetStateAction<{
                characterId: string | undefined;
                characterName: string | undefined;
                characterImg: string;
              }>
            >
          }
        />
        <div className="flex-grow flex items-center gap-[1rem] p-[.5rem]">
          <div className="relative min-w-[20rem] flex-grow">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTypes((prev) => !prev);
              }}
              className={`${
                !typeToRus?.trim().length ? "bg-secondary" : `${appearancePartColors[typeToRus]}`
              } text-[1.7rem] w-full min-w-fit text-text-light outline-gray-600 transition-all rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
            >
              {typeToRus || "Тип"}
            </button>

            <AsideScrollable
              ref={modalRef}
              className={`${showAllTypes ? "" : "hidden"} translate-y-[.5rem] min-w-fit right-0`}
            >
              {AllAppearancePartRusVariations.map((rv) => (
                <AppearanceAsideButton
                  key={rv}
                  typeRus={rv}
                  currentTypeRus={typeToRus}
                  setShowAllTypes={setShowAllTypes}
                  setCurrentType={setCurrentType}
                  setTypeToRus={setTypeToRus}
                />
              ))}
            </AsideScrollable>
          </div>

          <PlotfieldButton className="min-w-[15rem] bg-secondary self-end hover:bg-primary text-[1.9rem]">
            Создать
          </PlotfieldButton>
        </div>
      </div>
    </form>
  );
}
