import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useDeleteAppearancePart from "../../../../../../hooks/Deleting/Appearance/useDeleteAppearancePart";
import useGetAppearancePartById from "../../../../../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../../types/Additional/TranslationTypes";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationAppearancePart, {
  AllMightySearchAppearancePartResultTypes,
} from "../../../hooks/useGetPaginatedTranslationAppearancePart";
import LoadMoreButton from "../shared/LoadMoreButton";
import { EditingAppearancePartForm } from "./EditingAppearancePart";
import AppearanceItem from "./AppearanceItem";

type AllMightySearchMainContentAppearanceTypes = {
  debouncedValue: string;
  characterId: string;
  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
  newElement: TranslationAppearancePartTypes | null;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationAppearancePartTypes | null>>;
};

export type TempAppearancePartTypes = {
  appearancePartId: string;
  translatedAppearancePartId: string;
  text: string;
  img?: string;
  characterId: string;
  characterName: string;
  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
};

export type TempAppearanceCharacterTypes = {
  characterName: string;
  characterImg?: string;
  characterId: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentAppearance({
  debouncedValue,
  characterId,
  currentCategory,
  newElement,
  setNewElement,
  type,
}: AllMightySearchMainContentAppearanceTypes) {
  const { storyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedAppearanceParts,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useGetPaginatedTranslationAppearancePart({
    language: "russian",
    limit: LIMIT,
    page: currentPage,
    storyId: storyId || "",
    characterId,
    type,
  });

  const { data: appearanceTranslatedWithoutCharacter } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
    enabled: !!storyId && (status === "error" || status === "pending" || status === "success"),
  });

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchAppearancePartResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingAppearancePart, setEditingAppearancePart] = useState<TempAppearancePartTypes | null>(null);
  const [updatedAppearancePart, setUpdatedAppearancePart] = useState<TempAppearancePartTypes | null>(null);
  const [updatedCharacter, setUpdatedCharacter] = useState<TempAppearanceCharacterTypes | null>(null);

  const memoizedAppearanceParts = useMemo(() => {
    const res: TranslationAppearancePartTypes[] = [];
    if (appearanceTranslatedWithoutCharacter?.length) {
      const appearancePartArr = [...appearanceTranslatedWithoutCharacter];
      if (updatedAppearancePart) {
        const index = appearancePartArr.findIndex((k) => k._id === updatedAppearancePart.translatedAppearancePartId);
        const currentAppearancePart = appearancePartArr.find(
          (k) => k._id === updatedAppearancePart.translatedAppearancePartId
        );
        const translations = currentAppearancePart?.translations?.map((r) => ({
          ...r,
          text: r.textFieldName ? updatedAppearancePart.text : r.text,
        }));
        appearancePartArr[index].characterId = updatedAppearancePart.characterId;
        appearancePartArr[index].type = updatedAppearancePart.type as TranslationTextFieldNameAppearancePartsTypes;

        if (translations && typeof translations !== "undefined") {
          appearancePartArr[index].translations = translations;
        }
      }

      if (debouncedValue?.trim().length) {
        const newArr = appearanceTranslatedWithoutCharacter.filter((k) =>
          (k.translations || [])[0]?.text?.toLowerCase()?.includes(debouncedValue.toLowerCase())
        );
        res.push(...newArr);
      }
    }
    return res;
  }, [appearanceTranslatedWithoutCharacter, debouncedValue, updatedAppearancePart]);

  useEffect(() => {
    if (paginatedAppearanceParts?.pages) {
      setAllPaginatedResults((prev) => {
        if (prev.length) {
          const combinedResults = [...prev, ...paginatedAppearanceParts.pages];
          // Deduplicate by ensuring unique `next.page` values
          const deduplicatedResults = combinedResults.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
          );
          return deduplicatedResults;
        } else {
          return [...paginatedAppearanceParts.pages];
        }
      });
    }
  }, [paginatedAppearanceParts]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some(
            (p) => p.appearancePartId === (newElement as TranslationAppearancePartTypes).appearancePartId
          )
            ? [
                ...page.results,
                {
                  _id: "",
                  characterId: newElement.characterId,
                  type: newElement.type,
                  appearancePartId: newElement.appearancePartId,
                  commandId: "",
                  createdAt: newElement.createdAt,
                  language: newElement.language,
                  storyId: storyId || "",
                  topologyBlockId: "",
                  updatedAt: newElement.updatedAt,
                  translations: [
                    {
                      _id: "",
                      amountOfWords: (newElement.translations || [])[0]?.text?.length || 0,
                      text: (newElement.translations || [])[0]?.text || "",
                      textFieldName: newElement.type,
                    },
                  ],
                },
              ]
            : page?.results,
        }))
      );
    }
  }, [newElement]);

  useEffect(() => {
    if (status === "error") {
      console.error("AppearancePart, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "appearance" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[10px] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[10px] flex-wrap p-[10px] justify-center">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentAppearanceBlock
                    key={pr?.appearancePartId}
                    page={currentPage}
                    limit={LIMIT}
                    characterId={pr.characterId}
                    updatedCharacter={updatedCharacter}
                    appearanceId={pr.appearancePartId}
                    translationAppearanceId={pr._id}
                    setEditingAppearance={setEditingAppearancePart}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    appearanceText={(pr.translations || [])[0]?.text}
                    newElement={newElement}
                    type={pr.type}
                    updatedAppearancePart={updatedAppearancePart}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedAppearanceParts?.map((p) => (
                <ContentAppearanceBlock
                  key={p?.appearancePartId}
                  page={currentPage}
                  appearanceId={p.appearancePartId}
                  limit={LIMIT}
                  characterId={p.characterId}
                  updatedCharacter={updatedCharacter}
                  translationAppearanceId={p._id}
                  setEditingAppearance={setEditingAppearancePart}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  appearanceText={(p.translations || [])[0]?.text}
                  newElement={newElement}
                  type={p.type}
                  updatedAppearancePart={updatedAppearancePart}
                  setNewElement={setNewElement}
                />
              ))
            : null}
        </div>

        <LoadMoreButton<AllMightySearchAppearancePartResultTypes>
          allPaginatedResults={allPaginatedResults}
          currentPage={currentPage}
          debouncedValue={debouncedValue}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setCurrentPage={setCurrentPage}
          type="одежды"
        />
      </div>

      <EditingAppearancePartForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingAppearancePart={editingAppearancePart}
        setUpdatedCharacter={setUpdatedCharacter}
        setUpdatedAppearancePart={setUpdatedAppearancePart}
      />
    </>
  );
}

type ContentAppearanceBlockTypes = {
  appearanceId: string;
  appearanceText?: string;
  storyId: string;
  translationAppearanceId: string;
  page: number;
  characterId: string;
  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
  limit: number;
  updatedAppearancePart: TempAppearancePartTypes | null;
  updatedCharacter: TempAppearanceCharacterTypes | null;
  newElement: TranslationAppearancePartTypes | null;
  setEditingAppearance: React.Dispatch<React.SetStateAction<TempAppearancePartTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationAppearancePartTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchAppearancePartResultTypes[]>>;
};

function ContentAppearanceBlock({
  appearanceId,
  appearanceText,
  updatedCharacter,
  translationAppearanceId,
  newElement,
  type,
  characterId,
  updatedAppearancePart,
  setEditingAppearance,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentAppearanceBlockTypes) {
  const { storyId } = useParams();
  const { data: appearancePart } = useGetAppearancePartById({ appearancePartId: appearanceId });
  const [apperanceType, setAppearanceType] = useState<TranslationTextFieldNameAppearancePartsTypes | "temp">(type);
  const [currentAppearanceText, setCurrentAppearanceText] = useState(appearanceText || "");
  const [currentCharacterId, setCurrentCharacterId] = useState(characterId || "");
  const [characterName, setCharacterName] = useState("");
  const { data: translationCharacter } = useGetTranslationCharacterById({
    characterId: currentCharacterId,
    language: "russian",
  });

  const [appearanceImg, setAppearanceImg] = useState(appearancePart?.img);

  useEffect(() => {
    if (characterId?.trim().length) {
      setCurrentCharacterId(characterId);
    }
  }, [characterId]);

  useEffect(() => {
    if (appearanceText?.trim().length) {
      setCurrentAppearanceText(appearanceText);
    }
  }, [appearanceText]);

  useEffect(() => {
    if (
      updatedAppearancePart &&
      updatedAppearancePart.text !== appearanceText &&
      updatedAppearancePart.appearancePartId === appearanceId
    ) {
      setCurrentAppearanceText(updatedAppearancePart.text);
    }
  }, [appearanceText, appearanceId, updatedAppearancePart]);

  useEffect(() => {
    if (
      updatedCharacter &&
      updatedAppearancePart &&
      updatedAppearancePart.characterId !== characterId &&
      updatedAppearancePart.appearancePartId === appearanceId
    ) {
      setCurrentCharacterId(updatedAppearancePart.characterId);
      setCharacterName(updatedCharacter.characterName);
    }
  }, [updatedAppearancePart, updatedCharacter, appearanceId, characterId]);

  useEffect(() => {
    if (translationCharacter) {
      translationCharacter.translations?.map((tt) => {
        if (tt.textFieldName === "characterName") {
          setCharacterName(tt.text);
        }
      });
    }
  }, [translationCharacter]);

  const removeAppearance = useDeleteAppearancePart({ language: "russian", storyId: storyId || "" });

  const handleRemove = ({ appearanceId }: { appearanceId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr.appearancePartId !== appearanceId),
      }))
    );
    if ((newElement as TranslationAppearancePartTypes)?.appearancePartId === appearanceId) {
      setNewElement(null);
    }
    removeAppearance.mutate({ appearancePartId: appearanceId });
  };

  useEffect(() => {
    if (appearancePart) {
      setAppearanceImg(appearancePart?.img);
    }
  }, [appearancePart]);

  useEffect(() => {
    if (
      updatedAppearancePart?.img &&
      updatedAppearancePart.img !== appearanceImg &&
      updatedAppearancePart.appearancePartId === appearanceId
    ) {
      setAppearanceImg(updatedAppearancePart.img);
    }
  }, [updatedAppearancePart, appearanceImg, appearanceId]);

  return (
    <div className="relative h-[350px] flex-grow min-w-[200px] bg-accent rounded-md md:max-w-[350px] flex flex-col gap-[10px]">
      <AppearanceItem
        appearanceId={appearanceId}
        appearanceText={appearanceText}
        characterName={characterName}
        setAppearanceType={setAppearanceType}
        type={type}
        updatedAppearancePart={updatedAppearancePart}
        appearanceImg={appearanceImg}
      />

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button className="text-text min-w-[75px] bg-accent text-[20px] p-[10px] hover:opacity-80 transition-all">
            {appearanceText}
          </Button>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              setStartEditing(true);
              setEditingAppearance({
                appearancePartId: appearanceId,
                translatedAppearancePartId: translationAppearanceId,
                text: currentAppearanceText || "",
                type: apperanceType,
                characterId,
                characterName,
                img: appearanceImg,
              });
            }}
          >
            Изменить
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleRemove({ appearanceId })}>Удалить</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
