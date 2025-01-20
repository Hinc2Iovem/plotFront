import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { useParams } from "react-router-dom";
import useDeleteCharacter from "../../../../../../hooks/Deleting/Character/useDeleteCharacter";
import { TranslationCharacterTypes } from "../../../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { AllMightySearchCharacterResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacter";
import { NewElementTypes } from "../AllMightySearchMainContent";
import { EditingCharacterTypes } from "./AllMightySearchMainContentCharacter";

type SuggestiveModalTypes = {
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
  setEditingCharacter: React.Dispatch<React.SetStateAction<EditingCharacterTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SuggestiveModal({
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
}: SuggestiveModalTypes) {
  const { storyId } = useParams();

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
  };

  return (
    <ContextMenuContent>
      <ContextMenuItem
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}
      >
        Изменить
      </ContextMenuItem>
      <ContextMenuItem onClick={handleDelete}>Удалить</ContextMenuItem>
    </ContextMenuContent>
  );
}
