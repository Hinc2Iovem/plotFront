import { Button } from "@/components/ui/button";
import StoryAttributesSelectAppearanceType from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesSelectAppearanceType";
import { useEffect, useRef, useState } from "react";
import { appearancePartColors } from "../../../../../../const/APPEARACE_PARTS";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateAppearancePartTranslation from "../../../../../../hooks/Patching/Translation/useUpdateAppearancePartTranslation";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "../../../../../../types/StoryData/AppearancePart/AppearancePartTypes";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PreviewImage from "../../../../../../ui/shared/PreviewImage";
import PlotfieldCharacterPromptMain from "../../../../PlotField/PlotFieldMain/Commands/Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchAppearancePartResultTypes } from "../../../hooks/useGetPaginatedTranslationAppearancePart";
import { TempAppearanceCharacterTypes, TempAppearancePartTypes } from "./AllMightySearchMainContentAppearance";

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
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });
  const [currentType, setCurrentType] = useState<TranslationTextFieldNameAppearancePartsTypes | "temp">(
    editingAppearancePart?.type ? editingAppearancePart.type : "temp"
  );

  const updateAppearancePart = useUpdateAppearancePartTranslation({
    appearancePartId: editingAppearancePart?.appearancePartId || "",
    language: "russian",
    characterId: characterValue?._id || "",
  });

  const updateAppearancePartImg = useUpdateImg({
    id: editingAppearancePart?.appearancePartId || "",
    path: "/appearanceParts",
    preview: imagePreview,
  });

  useEffect(() => {
    if (character) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: character?.img || "",
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
      characterId: characterValue._id || "",
      characterName: characterValue.characterName || "",
      characterImg: characterValue.imgUrl || "",
    });

    setUpdatedAppearancePart({
      appearancePartId: editingAppearancePart?.appearancePartId || "",
      text: currentText,
      translatedAppearancePartId: editingAppearancePart?.translatedAppearancePartId || "",
      characterId: characterValue._id || "",
      type: currentType || "temp",
      img: typeof imagePreview === "string" ? imagePreview : "",
      characterName: characterValue?.characterName || "",
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
      setCharacterValue((prev) => ({
        ...prev,
        _id: editingAppearancePart.characterId,
      }));
    }
    if (editingAppearancePart?.img) {
      setImagePreview(editingAppearancePart.img);
    }
    if (editingAppearancePart?.characterName) {
      setCharacterValue((prev) => ({
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
      } h-full flex flex-col gap-[10px]`}
    >
      <form
        className="flex gap-[10px] flex-col p-[5px] items-center border-border border-[2px] rounded-md ml-[5px]"
        onSubmit={handleSubmit}
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
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="text-[20px] min-w-[200px] flex-grow w-auto"
            placeholder="Внешний вид"
          />

          <AppearanceCharacterField setCharacterValue={setCharacterValue} characterValue={characterValue} />
          <div className="flex-grow flex items-center gap-[10px] p-[5px]">
            <StoryAttributesSelectAppearanceType
              filterOrForm="form"
              currentAppearanceType={currentType}
              setCurrentAppearanceType={setCurrentType}
              defaultTrigger={false}
              triggerClasses={appearancePartColors[typeToRus]}
            />

            <Button className="min-w-[150px] justify-center hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] flex-grow bg-brand-gradient text-white self-end text-[20px] transition-all">
              Изменить
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

type AppearanceCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
};

export function AppearanceCharacterField({ characterValue, setCharacterValue }: AppearanceCharacterFieldTypes) {
  return (
    <div className="min-w-[200px] flex-grow relative flex items-center">
      <PlotfieldCharacterPromptMain
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        characterValue={characterValue}
        setCharacterValue={setCharacterValue}
        inputClasses="w-full pr-[35px] text-text md:text-[17px]"
        imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
      />
    </div>
  );
}
