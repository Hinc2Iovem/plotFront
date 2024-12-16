import { useRef } from "react";
import { useParams } from "react-router-dom";
import useDeleteCharacter from "../../../../../../hooks/Deleting/Character/useDeleteCharacter";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationCharacterTypes } from "../../../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import { AllMightySearchCharacterResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacter";
import { NewElementTypes } from "../AllMightySearchMainContent";
import { EditingCharacterTypes } from "./AllMightySearchMainContentCharacter";

type SuggestiveModalTypes = {
  showBackSide: boolean;
  showSuggestiveModal: boolean;
  characterId: string;
  characterName: string;
  characterDescription: string;
  characterUnknownName: string;
  nameTag: string;
  characterImg: string;
  characterType: CharacterTypes;
  newElement: NewElementTypes;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchCharacterResultTypes[]>>;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  setShowSuggestiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCharacter: React.Dispatch<React.SetStateAction<EditingCharacterTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SuggestiveModal({
  showBackSide,
  showSuggestiveModal,
  characterId,
  newElement,
  characterName,
  characterDescription,
  characterUnknownName,
  nameTag,
  characterImg,
  characterType,
  setAllPaginatedResults,
  setNewElement,
  setEditingCharacter,
  setStartEditing,
  setShowSuggestiveModal,
}: SuggestiveModalTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteCharacter = useDeleteCharacter({
    characterId,
    invalidateQueryKey: ["translation", "russian", "character", "type", "all", "story", storyId || "", "search", ""],
    exact: true,
  });

  const handleDelete = () => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr.characterId !== characterId),
      }))
    );

    if ((newElement as TranslationCharacterTypes)?.characterId === characterId) {
      setNewElement(null);
    }

    deleteCharacter.mutate();

    setShowSuggestiveModal(false);
  };

  const handleEdit = () => {
    setEditingCharacter({
      characterId,
      characterType,
      name: characterName,
      description: characterDescription,
      img: characterImg,
      nameTag,
      unknownName: characterUnknownName,
    });
    setStartEditing(true);
    setShowSuggestiveModal(false);
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowSuggestiveModal,
    showModal: showSuggestiveModal,
  });
  return (
    <aside
      ref={modalRef}
      className={`${showBackSide ? "hidden" : ""} ${showSuggestiveModal ? "" : "hidden"}
    w-full flex gap-[.5rem] p-[.5rem] rounded-md bg-primary-darker absolute bottom-0
    `}
    >
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}
      >
        Изменить
      </PlotfieldButton>
      <PlotfieldButton onClick={handleDelete}>Удалить</PlotfieldButton>
    </aside>
  );
}
