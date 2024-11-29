import { useEffect, useRef, useState } from "react";
import { AllAppearancePartRusVariations, appearancePartColors } from "../../../../../../const/APPEARACE_PARTS";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateAppearancePartTranslation from "../../../../../../hooks/Patching/Translation/useUpdateAppearancePartTranslation";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "../../../../../../types/StoryData/AppearancePart/AppearancePartTypes";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchAppearancePartResultTypes } from "../../../hooks/useGetPaginatedTranslationAppearancePart";
import { TempAppearanceCharacterTypes, TempAppearancePartTypes } from "./AllMightySearchMainContentAppearance";
import PreviewImage from "../../../../../shared/utilities/PreviewImage";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import PlotfieldCharacterPromptMain from "../../../../PlotField/PlotFieldMain/Commands/Prompts/Characters/PlotfieldCharacterPromptMain";
import { DebouncedCheckCharacterTypes } from "../../../../PlotField/PlotFieldMain/Commands/Choice/ChoiceQuestionField";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";

type EditingAppearancePartFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingAppearancePart: TempAppearancePartTypes | null;
  setUpdatedCharacter: React.Dispatch<React.SetStateAction<TempAppearanceCharacterTypes | null>>;
  setUpdatedAppearancePart: React.Dispatch<React.SetStateAction<TempAppearancePartTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchAppearancePartResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingAppearancePartForm({
  currentCategory,
  setStartEditing,
  setUpdatedCharacter,
  setUpdatedAppearancePart,
  setAllPaginatedResults,
  startEditing,
  editingAppearancePart,
}: EditingAppearancePartFormTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentText, setCurrentText] = useState(editingAppearancePart?.text || "");
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  const [typeToRus, setTypeToRus] = useState<AppearancePartVariationRusTypes>(
    editingAppearancePart?.type === "accessory"
      ? "украшение"
      : editingAppearancePart?.type === "art"
      ? "татуировка"
      : editingAppearancePart?.type === "body"
      ? "тело"
      : editingAppearancePart?.type === "dress"
      ? "внешний вид"
      : editingAppearancePart?.type === "hair"
      ? "волосы"
      : editingAppearancePart?.type === "skin"
      ? "кожа"
      : "остальное"
  );

  const { data: character } = useGetCharacterById({ characterId: editingAppearancePart?.characterId || "" });
  const [currentCharacter, setCurrentCharacter] = useState({
    characterId: editingAppearancePart?.characterId,
    characterName: editingAppearancePart?.characterName,
    characterImg: character?.img || "",
  });
  const [currentType, setCurrentType] = useState<TranslationTextFieldNameAppearancePartsTypes | "temp">(
    editingAppearancePart?.type ? editingAppearancePart.type : "temp"
  );

  const updateAppearancePart = useUpdateAppearancePartTranslation({
    appearancePartId: editingAppearancePart?.appearancePartId || "",
    language: "russian",
    characterId: currentCharacter?.characterId || "",
  });

  const updateAppearancePartImg = useUpdateImg({
    id: editingAppearancePart?.appearancePartId || "",
    path: "/appearanceParts",
    preview: imagePreview,
  });

  useEffect(() => {
    if (character) {
      setCurrentCharacter((prev) => ({
        ...prev,
        characterImg: character?.img || "",
      }));
    }
  }, [character]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      console.error("Can not edit an empty appearancePart");
      return;
    }

    setUpdatedCharacter({
      characterId: currentCharacter.characterId || "",
      characterName: currentCharacter.characterName || "",
      characterImg: currentCharacter.characterImg,
    });

    setUpdatedAppearancePart({
      appearancePartId: editingAppearancePart?.appearancePartId || "",
      text: currentText,
      translatedAppearancePartId: editingAppearancePart?.translatedAppearancePartId || "",
      characterId: currentCharacter.characterId || "",
      type: currentType || "temp",
      img: typeof imagePreview === "string" ? imagePreview : "",
      characterName: currentCharacter?.characterName || "",
    });

    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          translations:
            ppr.appearancePartId === editingAppearancePart?.appearancePartId
              ? ppr.translations?.map((pprt, index) =>
                  index === 0
                    ? {
                        ...pprt,
                        amountOfWords: currentText.length,
                        text: currentText,
                        textFieldName: currentType as TranslationTextFieldNameAppearancePartsTypes,
                      }
                    : { ...pprt }
                )
              : ppr.translations,
        })),
      }))
    );
    setStartEditing(false);
    await Promise.all([
      updateAppearancePartImg.mutateAsync({}),
      updateAppearancePart.mutateAsync({
        appearancePartName: currentText,
        appearancePartType: currentType as TranslationTextFieldNameAppearancePartsTypes,
      }),
    ]);
  };

  useEffect(() => {
    if (editingAppearancePart?.text) {
      setCurrentText(editingAppearancePart.text);
    }
    if (editingAppearancePart?.characterId) {
      setCurrentCharacter((prev) => ({
        ...prev,
        characterId: editingAppearancePart.characterId,
      }));
    }
    if (editingAppearancePart?.img) {
      setImagePreview(editingAppearancePart.img);
    }
    if (editingAppearancePart?.characterName) {
      setCurrentCharacter((prev) => ({
        ...prev,
        characterName: editingAppearancePart.characterName,
      }));
    }
    if (editingAppearancePart?.type) {
      setTypeToRus(
        editingAppearancePart?.type === "accessory"
          ? "украшение"
          : editingAppearancePart?.type === "art"
          ? "татуировка"
          : editingAppearancePart?.type === "body"
          ? "тело"
          : editingAppearancePart?.type === "dress"
          ? "внешний вид"
          : editingAppearancePart?.type === "hair"
          ? "волосы"
          : editingAppearancePart?.type === "skin"
          ? "кожа"
          : "остальное"
      );
      setCurrentType(editingAppearancePart.type);
    }
  }, [editingAppearancePart]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowAllTypes,
    showModal: showAllTypes,
  });

  return (
    <div
      className={`${currentCategory === "appearance" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] flex-col p-[.5rem] items-center" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-[.5rem] flex-col w-[40rem] p-[.5rem] shadow-md rounded-md bg-primary-darker">
          <div className="relative w-full h-[20rem] bg-secondary rounded-md">
            <PreviewImage
              imagePreview={imagePreview}
              setPreview={setImagePreview}
              imgClasses="w-full h-[50%] object-contain translate-1/2 absolute top-1/4"
            />
          </div>

          <PlotfieldInput
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="text-[2rem] min-w-[20rem] flex-grow w-auto"
            placeholder="Внешний вид"
          />

          <AppearanceCharacterField
            characterId={currentCharacter.characterId || ""}
            characterName={currentCharacter.characterName || ""}
            characterImg={currentCharacter.characterImg || ""}
            setCurrentCharacter={setCurrentCharacter}
          />
          <div className="flex-grow flex items-center gap-[1rem] p-[.5rem]">
            <div className="relative min-w-[20rem] flex-grow">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTypes((prev) => !prev);
                }}
                className={`${appearancePartColors[typeToRus]} text-[1.7rem] w-full min-w-fit text-text-light outline-gray-600 transition-all rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
              >
                {typeToRus}
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
              Изменить
            </PlotfieldButton>
          </div>
        </div>
      </form>
    </div>
  );
}

type AppearanceAsideButtonTypes = {
  typeRus: AppearancePartVariationRusTypes;
  currentTypeRus: AppearancePartVariationRusTypes;
  setShowAllTypes: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentType: React.Dispatch<React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes | "temp">>;
  setTypeToRus: React.Dispatch<React.SetStateAction<AppearancePartVariationRusTypes>>;
};

export function AppearanceAsideButton({
  typeRus,
  currentTypeRus,
  setCurrentType,
  setShowAllTypes,
  setTypeToRus,
}: AppearanceAsideButtonTypes) {
  const [backgroundColorOnHover, setBackgroundColorOnHover] = useState("bg-secondary");

  return (
    <button
      type="button"
      onClick={() => {
        const typeToEng: TranslationTextFieldNameAppearancePartsTypes | "temp" =
          typeRus === "внешний вид"
            ? "dress"
            : typeRus === "волосы"
            ? "hair"
            : typeRus === "кожа"
            ? "skin"
            : typeRus === "остальное"
            ? "temp"
            : typeRus === "татуировка"
            ? "art"
            : typeRus === "тело"
            ? "body"
            : "accessory";
        setShowAllTypes(false);
        setCurrentType(typeToEng);
        setTypeToRus(typeRus);
      }}
      onMouseOver={() => setBackgroundColorOnHover(appearancePartColors[typeRus])}
      onFocus={() => setBackgroundColorOnHover(appearancePartColors[typeRus])}
      onBlur={() => setBackgroundColorOnHover("be-secondary")}
      onMouseLeave={() => setBackgroundColorOnHover("bg-secondary")}
      className={`${
        currentTypeRus === typeRus ? "hidden" : ""
      } text-text-light capitalize text-[1.5rem] outline-gray-600 w-full ${backgroundColorOnHover} px-[.5rem] py-[.5rem] rounded-md transition-all focus-within:border-[2px] focus-within:border-white
    hover:${appearancePartColors[typeRus]} focus-within:${appearancePartColors[typeRus]}`}
    >
      {typeRus}
    </button>
  );
}

type AppearanceCharacterFieldTypes = {
  setCurrentCharacter: React.Dispatch<
    React.SetStateAction<{
      characterId: string | undefined;
      characterName: string | undefined;
      characterImg: string;
    }>
  >;
  characterName: string;
  characterImg: string;
  characterId: string;
};

export function AppearanceCharacterField({
  characterId,
  characterImg,
  characterName,
  setCurrentCharacter,
}: AppearanceCharacterFieldTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const debouncedValue = useDebounce({ value: characterName, delay: 600 });
  const preventClickRef = useRef(false);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If a double-click has occurred recently, ignore this click
    if (preventClickRef.current) {
      return;
    }

    setShowCharacterModal((prev) => !prev);
  };

  const handleInputDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    preventClickRef.current = true;

    setTimeout(() => {
      preventClickRef.current = false;
    }, 300);

    setShowCharacterModal(true);
  };

  return (
    <div className="min-w-[20rem] flex-grow relative flex items-center">
      <PlotfieldInput
        onClick={handleInputClick}
        onDoubleClick={handleInputDoubleClick}
        value={characterName}
        onChange={(e) => {
          setCurrentCharacter((prev) => ({
            ...prev,
            characterName: e.target.value,
          }));
          setShowCharacterModal(true);
        }}
        placeholder="Персонаж"
        className="text-[2rem] pr-[4rem]"
      />
      {characterImg ? (
        <img
          src={characterImg}
          alt="CharacterImg"
          className="w-[3.5rem] rounded-md object-contain absolute right-[.2rem]"
        />
      ) : null}

      <PlotfieldCharacterPromptMain
        characterValue={characterName}
        commandIfId=""
        isElse={false}
        setShowCharacterModal={setShowCharacterModal}
        showCharacterModal={showCharacterModal}
        debouncedValue={debouncedValue}
        currentCharacterId={characterId}
        setDebouncedCharacter={
          setCurrentCharacter as React.Dispatch<React.SetStateAction<DebouncedCheckCharacterTypes | null>>
        }
        translateAsideValue="translate-y-[10rem]"
      />
    </div>
  );
}
