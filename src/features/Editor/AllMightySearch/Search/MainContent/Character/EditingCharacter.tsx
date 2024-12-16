import { useParams } from "react-router-dom";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchCharacterResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacter";
import { EditingCharacterTypes, MainCharacterTypes } from "./AllMightySearchMainContentCharacter";
import { useEffect, useRef, useState } from "react";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import useUpdateMainCharacterByStoryId from "../../../../../../hooks/Patching/Character/useUpdateMainCharacterByStoryId";
import useUpdateCharacter from "../../../../../../hooks/Patching/Character/useUpdateCharacter";
import useUpdateCharacterTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacterTranslation";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldTextarea from "../../../../../../ui/Textareas/PlotfieldTextarea";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import PreviewImage from "../../../../../../ui/shared/PreviewImage";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";

type CharacterEditingFormTypes = {
  startEditing: boolean;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  mainCharacter: MainCharacterTypes | null;
  editingCharacter: EditingCharacterTypes | null;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setMainCharacter: React.Dispatch<React.SetStateAction<MainCharacterTypes | null>>;
  setUpdatedCharacter: React.Dispatch<React.SetStateAction<EditingCharacterTypes | null>>;
  setMainCharacterWasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchCharacterResultTypes[]>>;
};

export type CharacterRusTypes = "ГГ" | "Второй План" | "Третий План";

export const ALL_CHARACTER_TYPES_RUS: CharacterRusTypes[] = ["ГГ", "Второй План", "Третий План"];

export function CharacterEditingForm({
  startEditing,
  currentCategory,
  mainCharacter,
  editingCharacter,
  setStartEditing,
  setMainCharacter,
  setUpdatedCharacter,
  setMainCharacterWasChanged,
  setAllPaginatedResults,
}: CharacterEditingFormTypes) {
  const { storyId } = useParams();
  const [characterName, setCharacterName] = useState(editingCharacter?.name);
  const [characterDescription, setCharacterDescription] = useState(editingCharacter?.description);
  const [characterUnknownName, setCharacterUnknownName] = useState(editingCharacter?.unknownName);

  const [suggestReassigningMainCharacter, setSuggestReassigningMainCharacter] = useState(false);

  const [characterType, setCharacterType] = useState<CharacterTypes>(
    editingCharacter?.characterType || ("" as CharacterTypes)
  );

  const [nameTag, setNameTag] = useState(editingCharacter?.nameTag || "");
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(editingCharacter?.img || null);

  const [characterTypeRus, setCharacterTypeRus] = useState<CharacterRusTypes>(
    characterType === "emptycharacter" ? "Третий План" : characterType === "maincharacter" ? "ГГ" : "Второй План"
  );

  useEffect(() => {
    if (characterType) {
      setCharacterTypeRus(
        characterType === "emptycharacter" ? "Третий План" : characterType === "maincharacter" ? "ГГ" : "Второй План"
      );
    }
  }, [characterType]);

  const [showTypes, setShowTypes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharacterName(editingCharacter?.name);
    setCharacterDescription(editingCharacter?.description);
    setCharacterUnknownName(editingCharacter?.unknownName);
    setCharacterType(editingCharacter?.characterType || ("" as CharacterTypes));
    setImagePreview(editingCharacter?.img || null);
    setNameTag(editingCharacter?.nameTag || "");
  }, [editingCharacter]);

  const updateMainCharacter = useUpdateMainCharacterByStoryId({
    characterId: editingCharacter?.characterId || "",
    language: "russian",
    storyId: storyId || "",
  });

  const updateCharacter = useUpdateCharacter({ characterId: editingCharacter?.characterId || "" });
  const updateCharacterText = useUpdateCharacterTranslation({
    characterId: editingCharacter?.characterId || "",
    language: "russian",
  });

  const uploadImgMutation = useUpdateImg({
    id: editingCharacter?.characterId || "",
    path: "/characters",
    preview: imagePreview,
  });

  const handleSubmit = async ({
    e,
    reassignMainCharacter = false,
  }: {
    e?: React.FormEvent;
    reassignMainCharacter?: boolean;
  }) => {
    if (e) {
      e.preventDefault();
    }

    if (!editingCharacter?.name?.trim().length) {
      console.log("You can not submit character without name");
      return;
    }

    if (
      !reassignMainCharacter &&
      mainCharacter &&
      characterType === "maincharacter" &&
      editingCharacter.characterId !== mainCharacter.characterId
    ) {
      console.log("Are you sure you want to change main character?");
      setSuggestReassigningMainCharacter(true);
      return;
    }

    if (reassignMainCharacter) {
      setMainCharacterWasChanged(true);
      setMainCharacter({
        characterId: editingCharacter.characterId,
        characterName: characterName || "",
        characterImg: typeof imagePreview === "string" ? imagePreview : "",
      });
      updateMainCharacter.mutate();
    }

    setUpdatedCharacter({
      characterId: editingCharacter.characterId || "",
      characterType,
      name: characterName || "",
      description: characterDescription,
      nameTag,
      img: typeof imagePreview === "string" ? imagePreview : editingCharacter.img,
      unknownName: characterUnknownName,
    });

    setSuggestReassigningMainCharacter(false);
    setStartEditing(false);

    setAllPaginatedResults((pr) =>
      pr.map((prr) => ({
        ...prr,
        results: prr.results.map((pres) => ({
          ...pres,
          characterType: editingCharacter.characterId === pres.characterId ? characterType : pres.characterType,
        })),
      }))
    );

    if (editingCharacter.characterType === "minorcharacter") {
      await Promise.all([
        updateCharacterText.mutateAsync({
          debouncedValue: characterName,
          textFieldName: TranslationTextFieldName.CharacterName,
        }),
        updateCharacterText.mutateAsync({
          debouncedValue: characterDescription,
          textFieldName: TranslationTextFieldName.CharacterDescription,
        }),
        updateCharacterText.mutateAsync({
          debouncedValue: characterUnknownName,
          textFieldName: TranslationTextFieldName.CharacterUnknownName,
        }),
      ]);
    } else {
      updateCharacterText.mutate({
        debouncedValue: characterName,
        textFieldName: TranslationTextFieldName.CharacterName,
      });
    }

    if (imagePreview && imagePreview !== editingCharacter?.img) {
      await Promise.all([
        uploadImgMutation.mutateAsync({}),
        updateCharacter.mutateAsync({
          nameTag,
          type: characterType,
          currentLanguage: "russian",
        }),
      ]);
    } else {
      updateCharacter.mutate({
        type: characterType,
        img: imagePreview as string,
        nameTag,
        currentLanguage: "russian",
      });
    }
  };

  useOutOfModal({ modalRef, setShowModal: setShowTypes, showModal: showTypes });

  return (
    <div className={`${currentCategory === "character" ? "" : "hidden"} ${startEditing ? "" : "hidden"} relative`}>
      <form
        onSubmit={(e) => handleSubmit({ e })}
        className={`${suggestReassigningMainCharacter ? "hidden" : ""} w-full flex flex-col gap-[1rem] p-[1rem]`}
      >
        <div className="w-full flex gap-[1.5rem] flex-wrap">
          <div className="flex-grow relative min-w-[25rem]">
            <PlotfieldInput
              placeholder="Имя"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="border-[1px]"
            />
            <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
              <p className="text-text-light text-[1.3rem]">Имя</p>
            </div>
          </div>
          {editingCharacter?.characterType === "minorcharacter" ? (
            <>
              <div className="flex-grow relative min-w-[25rem]">
                <PlotfieldInput
                  placeholder="Скрытое Имя"
                  value={characterUnknownName}
                  onChange={(e) => setCharacterUnknownName(e.target.value)}
                  className="border-[1px]"
                />
                <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
                  <p className="text-text-light text-[1.3rem]">Скрытое Имя</p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {editingCharacter?.characterType === "minorcharacter" ? (
          <div className="relative w-full mt-[.5rem]">
            <PlotfieldTextarea
              placeholder="Описание"
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              className="border-[1px] min-h-[7rem]"
            />
            <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
              <p className="text-text-light text-[1.3rem]">Описание</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-[1rem] py-[1rem] items-center justify-center">
          <div className="flex gap-[1rem] flex-grow flex-col min-w-[20rem]">
            <div className="relative w-full">
              <PlotfieldButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTypes((prev) => !prev);
                }}
                className="bg-primary-darker hover:bg-primary"
              >
                {characterTypeRus}
              </PlotfieldButton>
              <AsideScrollable ref={modalRef} className={`${showTypes ? "" : "hidden"} translate-y-[.5rem]`}>
                {ALL_CHARACTER_TYPES_RUS.map((ct) => (
                  <CharacterEditingFormCharacterTypeButton
                    setCharacterType={setCharacterType}
                    setCharacterTypeRus={setCharacterTypeRus}
                    setShowTypes={setShowTypes}
                    characterTypeRus={characterTypeRus}
                    key={ct}
                    typeRus={ct}
                  />
                ))}
              </AsideScrollable>
            </div>
            <div className="relative w-full">
              <PlotfieldInput
                className="w-full border-[1px]"
                value={nameTag}
                onChange={(e) => setNameTag(e.target.value)}
                placeholder="Тэг"
              />
              <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
                <p className="text-text-light text-[1.3rem]">Тэг</p>
              </div>
            </div>
          </div>

          <div className="w-[20rem] h-[15rem] relative bg-primary rounded-md">
            <PreviewImage
              imagePreview={imagePreview}
              imgClasses="absolute w-[15rem] -translate-x-1/2 left-1/2 object-cover"
              setPreview={setImagePreview}
            />
          </div>
        </div>

        <div className="flex gap-[1rem] w-full">
          <PlotfieldButton onClick={() => setStartEditing(false)} type="button" className="bg-primary-darker">
            Отмена
          </PlotfieldButton>
          <PlotfieldButton type="submit" className="bg-primary-darker">
            Сохранить
          </PlotfieldButton>
        </div>
      </form>

      <aside
        className={`${
          suggestReassigningMainCharacter ? "" : "hidden"
        } bg-secondary z-[10] p-[1rem] flex flex-col gap-[1rem]`}
      >
        <h2 className="text-text-light text-[2rem] w-full">
          У этой истории уже есть главный персонаж, вы уверены что хотите его поменять?
        </h2>
        <div className="flex gap-[1rem]">
          <PlotfieldButton
            onClick={() => setSuggestReassigningMainCharacter(false)}
            type="button"
            className="bg-primary-darker"
          >
            Отмена
          </PlotfieldButton>
          <PlotfieldButton
            onClick={() => handleSubmit({ reassignMainCharacter: true })}
            type="button"
            className="bg-primary-darker"
          >
            Да
          </PlotfieldButton>
        </div>
      </aside>
    </div>
  );
}

type CharacterEditingFormCharacterTypeButtonTypes = {
  typeRus: CharacterRusTypes;
  characterTypeRus: CharacterRusTypes;
  setShowTypes: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterType: React.Dispatch<React.SetStateAction<CharacterTypes>>;
  setCharacterTypeRus: React.Dispatch<React.SetStateAction<CharacterRusTypes>>;
};

export function CharacterEditingFormCharacterTypeButton({
  typeRus,
  characterTypeRus,
  setCharacterType,
  setCharacterTypeRus,
  setShowTypes,
}: CharacterEditingFormCharacterTypeButtonTypes) {
  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        const typeToEng: CharacterTypes =
          typeRus === "ГГ" ? "maincharacter" : typeRus === "Второй План" ? "minorcharacter" : "emptycharacter";
        setCharacterType(typeToEng);
        setCharacterTypeRus(typeRus);
        setShowTypes(false);
      }}
      className={`${typeRus === characterTypeRus ? "bg-primary text-text-light" : ""}`}
    >
      {typeRus}
    </AsideScrollableButton>
  );
}
