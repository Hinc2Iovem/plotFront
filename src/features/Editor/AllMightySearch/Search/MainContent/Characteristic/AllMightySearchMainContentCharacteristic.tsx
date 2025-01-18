import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useDeleteCharacteristic from "../../../../../../hooks/Deleting/Characteristic/useDeleteCharacteristic";
import useGetAllCharacteristicsByStoryId from "../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import { TranslationCharacterCharacteristicTypes } from "../../../../../../types/Additional/TranslationTypes";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationCharacteristic, {
  AllMightySearchCharacteristicResultTypes,
} from "../../../hooks/useGetPaginatedTranslationCharacteristic";
import LoadMoreButton from "../shared/LoadMoreButton";
import { EditingCharacteristicForm } from "./EditingCharacteristic";

type AllMightySearchMainContentCharacteristicTypes = {
  debouncedValue: string;
  newElement: TranslationCharacterCharacteristicTypes | null;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationCharacterCharacteristicTypes | null>>;
};

export type TempCharacteristicTypes = {
  characteristicId: string;
  translatedCharacteristicId: string;
  text: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentCharacteristic({
  debouncedValue,
  currentCategory,
  newElement,
  setNewElement,
}: AllMightySearchMainContentCharacteristicTypes) {
  const { storyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedCharacteristics,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPaginatedTranslationCharacteristic({
    language: "russian",
    limit: LIMIT,
    page: currentPage,
    storyId: storyId || "",
  });

  const { data: translatedCharacteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
    enabled: !!storyId && (status === "error" || status === "pending" || status === "success"),
  });

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchCharacteristicResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingCharacteristic, setEditingCharacteristic] = useState<TempCharacteristicTypes | null>(null);
  const [updatedCharacteristic, setUpdatedCharacteristic] = useState<TempCharacteristicTypes | null>(null);

  const memoizedCharacteristics = useMemo(() => {
    const res: TranslationCharacterCharacteristicTypes[] = [];
    if (translatedCharacteristics?.length) {
      const characteristicArr = [...translatedCharacteristics];
      if (updatedCharacteristic) {
        const index = characteristicArr.findIndex((k) => k.characteristicId === updatedCharacteristic.characteristicId);
        const currentCharacteristic = characteristicArr.find(
          (k) => k.characteristicId === updatedCharacteristic.characteristicId
        );
        const translations = currentCharacteristic?.translations?.map((r) => ({
          ...r,
          text: r.textFieldName === "characterCharacteristic" ? updatedCharacteristic.text : r.text,
        }));
        if (translations && typeof translations !== "undefined") {
          characteristicArr[index].translations = translations || [];
        }
      }

      if (debouncedValue?.trim().length) {
        const newArr = translatedCharacteristics.filter((k) =>
          (k.translations || [])[0]?.text?.toLowerCase()?.includes(debouncedValue.toLowerCase())
        );
        res.push(...newArr);
      }
    }
    return res;
  }, [translatedCharacteristics, debouncedValue, updatedCharacteristic]);

  useEffect(() => {
    if (paginatedCharacteristics?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedCharacteristics.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedCharacteristics]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined && "characteristicId" in newElement) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some(
            (p) => p.characteristicId === (newElement as TranslationCharacterCharacteristicTypes).characteristicId
          )
            ? [
                ...page.results,
                {
                  _id: "",
                  characteristicId: newElement.characteristicId,
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
                      textFieldName: TranslationTextFieldName.CharacterCharacteristic as "characterCharacteristic",
                    },
                  ],
                },
              ]
            : page?.results,
        }))
      );
    }
  }, [newElement]);

  return (
    <>
      <div
        className={`${currentCategory === "characteristic" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[10px] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[10px] flex-wrap p-[10px]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentCharacteristicButton
                    key={pr?.characteristicId}
                    page={currentPage}
                    limit={LIMIT}
                    characteristicId={pr.characteristicId}
                    translationCharacteristicId={pr._id}
                    setEditingCharacteristic={setEditingCharacteristic}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    characteristicText={(pr.translations || [])[0]?.text}
                    newElement={newElement}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedCharacteristics?.map((p) => (
                <ContentCharacteristicButton
                  key={p?.characteristicId}
                  page={currentPage}
                  characteristicId={p.characteristicId}
                  limit={LIMIT}
                  translationCharacteristicId={p._id}
                  setEditingCharacteristic={setEditingCharacteristic}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  characteristicText={(p.translations || [])[0]?.text}
                  newElement={newElement}
                  setNewElement={setNewElement}
                />
              ))
            : null}
        </div>

        <LoadMoreButton<AllMightySearchCharacteristicResultTypes>
          allPaginatedResults={allPaginatedResults}
          currentPage={currentPage}
          debouncedValue={debouncedValue}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setCurrentPage={setCurrentPage}
          type="характеристик"
        />
      </div>

      <EditingCharacteristicForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingCharacteristic={editingCharacteristic}
        setUpdatedCharacteristic={setUpdatedCharacteristic}
      />
    </>
  );
}

type ContentCharacteristicButtonTypes = {
  characteristicId: string;
  characteristicText?: string;
  storyId: string;
  translationCharacteristicId: string;
  page: number;
  limit: number;
  newElement: TranslationCharacterCharacteristicTypes | null;
  setEditingCharacteristic: React.Dispatch<React.SetStateAction<TempCharacteristicTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationCharacterCharacteristicTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchCharacteristicResultTypes[]>>;
};

function ContentCharacteristicButton({
  characteristicId,
  characteristicText,
  translationCharacteristicId,
  newElement,
  setEditingCharacteristic,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentCharacteristicButtonTypes) {
  const { storyId } = useParams();

  const removeCharacteristic = useDeleteCharacteristic({
    characteristicId,
    currentLanguage: "russian",
    storyId: storyId || "",
  });

  const handleRemove = ({ characteristicId }: { characteristicId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr.characteristicId !== characteristicId),
      }))
    );
    if ((newElement as TranslationCharacterCharacteristicTypes)?.characteristicId === characteristicId) {
      setNewElement(null);
    }
    removeCharacteristic.mutate();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button className="text-text flex-grow min-w-[75px] bg-accent text-[15px] p-[10px]">
          {characteristicText}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setStartEditing(true);
            setEditingCharacteristic({
              characteristicId,
              text: characteristicText || "",
              translatedCharacteristicId: translationCharacteristicId,
            });
          }}
        >
          Изменить
        </ContextMenuItem>
        <ContextMenuItem className={``} onClick={() => handleRemove({ characteristicId })}>
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
