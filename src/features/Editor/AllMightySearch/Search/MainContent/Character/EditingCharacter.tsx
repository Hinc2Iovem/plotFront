import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateCharacter from "../../../../../../hooks/Patching/Character/useUpdateCharacter";
import useUpdateMainCharacterByStoryId from "../../../../../../hooks/Patching/Character/useUpdateMainCharacterByStoryId";
import useUpdateCharacterTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacterTranslation";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchCharacterResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacter";
import { EditingCharacterTypes, MainCharacterTypes } from "./AllMightySearchMainContentCharacter";
import CharacterForm from "./CharacterForm";

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
  const [characterNameTag, setCharacterNameTag] = useState(editingCharacter?.nameTag);
  const [characterDescription, setCharacterDescription] = useState(editingCharacter?.description);
  const [characterUnknownName, setCharacterUnknownName] = useState(editingCharacter?.unknownName);

  const [suggestReassigningMainCharacter, setSuggestReassigningMainCharacter] = useState(false);

  const [characterType, setCharacterType] = useState<CharacterTypes>(
    editingCharacter?.characterType || ("" as CharacterTypes)
  );

  const [nameTag, setNameTag] = useState(editingCharacter?.nameTag || "");
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(editingCharacter?.img || null);

  useEffect(() => {
    setCharacterName(editingCharacter?.name);
    setCharacterNameTag(editingCharacter?.nameTag);
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

  return (
    <div className={`${currentCategory === "character" ? "" : "hidden"} ${startEditing ? "" : "hidden"} relative`}>
      <CharacterForm
        characterDescription={characterDescription || ""}
        characterName={characterName || ""}
        characterType={editingCharacter?.characterType || characterType}
        characterUnknownName={characterUnknownName || ""}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
        setCharacterDescription={setCharacterDescription}
        setCharacterName={setCharacterName}
        setCharacterType={setCharacterType}
        setCharacterUnknownName={setCharacterUnknownName}
        setImagePreview={setImagePreview}
        setStarted={setStartEditing}
        type="edit"
        suggestReassigningMainCharacter={suggestReassigningMainCharacter}
        setCharacterNameTag={setCharacterNameTag}
        characterNameTag={characterNameTag}
      />

      {/* TODO suggest to reassign */}
      {/* <aside
        className={`${
          suggestReassigningMainCharacter ? "" : "hidden"
        } bg-secondary z-[10] p-[10px] flex flex-col gap-[10px]`}
      >
        <h2 className="text-text text-[2rem] w-full">
          У этой истории уже есть главный персонаж, вы уверены что хотите его поменять?
        </h2>
        <div className="flex gap-[10px]">
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
      </aside> */}
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
      className={`${typeRus === characterTypeRus ? "bg-primary text-text" : ""}`}
    >
      {typeRus}
    </AsideScrollableButton>
  );
}
