import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { KeyTypes } from "../../../../../../types/StoryEditor/PlotField/Key/KeyTypes";
import useDeleteKey from "../../../../PlotField/hooks/Key/useDeleteKey";
import useGetAllKeysByStoryId from "../../../../PlotField/hooks/Key/useGetAllKeysByStoryId";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedKey, { AllMightySearchKeyResultTypes } from "../../../hooks/useGetPaginatedKey";
import { NewElementTypes } from "../AllMightySearchMainContent";
import { EditingKeyForm } from "./EditingKey";

type AllMightySearchMainContentKeyTypes = {
  debouncedValue: string;
  newElement: NewElementTypes;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
};

export type TempKeyTypes = {
  keyId: string;
  keyText: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentKey({
  debouncedValue,
  newElement,
  currentCategory,
  setNewElement,
}: AllMightySearchMainContentKeyTypes) {
  const { storyId } = useParams();
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchKeyResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingKey, setEditingKey] = useState<TempKeyTypes | null>(null);
  const [updatedKey, setUpdatedKey] = useState<TempKeyTypes | null>(null);

  const {
    data: paginatedKeys,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetPaginatedKey({ limit: LIMIT, page: currentPage, storyId: storyId || "" });

  const { data: keys } = useGetAllKeysByStoryId({
    storyId: storyId || "",
    enabled: !!storyId && !!allPaginatedResults && (status === "success" || status === "error" || status === "pending"),
  });

  const memoizedKeys = useMemo(() => {
    const res: KeyTypes[] = [];
    if (keys?.length) {
      const keyArr = [...keys];
      if (updatedKey) {
        const index = keyArr.findIndex((k) => k._id === updatedKey.keyId);
        keyArr[index].text = updatedKey.keyText;
      }
      if (debouncedValue?.trim().length) {
        const newArr = keys.filter((k) => k.text?.toLowerCase()?.includes(debouncedValue.toLowerCase()));
        res.push(...newArr);
      }
    }
    return res;
  }, [keys, debouncedValue, updatedKey]);

  // When new key added I'll need to add it to allPaginatedResults or slice the last array inside allPaginatedResults, I think I done it

  useEffect(() => {
    if (paginatedKeys?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedKeys.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedKeys]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined && "text" in newElement) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some((p) => p._id === (newElement as KeyTypes)._id)
            ? [...page.results, newElement as KeyTypes]
            : page?.results,
        }))
      );
    }
  }, [newElement]);

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

  useEffect(() => {
    if (status === "error") {
      console.error("Key, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "key" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[10px] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[10px] flex-wrap p-[10px]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentKeyButton
                    key={pr?._id}
                    page={currentPage}
                    limit={LIMIT}
                    keyId={pr._id}
                    setEditingKey={setEditingKey}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    keyText={pr.text}
                    newElement={newElement}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedKeys?.map((p) => (
                <ContentKeyButton
                  key={p?._id}
                  page={currentPage}
                  limit={LIMIT}
                  keyId={p._id}
                  setEditingKey={setEditingKey}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  keyText={p.text}
                  newElement={newElement}
                  setNewElement={setNewElement}
                />
              ))
            : null}
        </div>

        <Button
          ref={ref}
          className={`${debouncedValue?.trim().length ? "hidden" : ""} ${
            !allPaginatedResults[allPaginatedResults.length - 1]?.next ? "bg-background" : "bg-accent"
          } text-[18px] text-text mt-[20px] ml-auto w-fit transition-all rounded-md px-[10px] py-[5px] whitespace-nowrap`}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => {
            if (hasNextPage) {
              setCurrentPage((prev) => prev + 1);
              fetchNextPage();
            }
          }}
        >
          {!allPaginatedResults[allPaginatedResults.length - 1]?.next
            ? "Больше ключей нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </Button>
      </div>

      <EditingKeyForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingKey={editingKey}
        setUpdatedKey={setUpdatedKey}
      />
    </>
  );
}

type ContentKeyButtonTypes = {
  keyId: string;
  keyText?: string;
  storyId: string;
  page: number;
  limit: number;
  newElement: NewElementTypes;
  setEditingKey: React.Dispatch<React.SetStateAction<TempKeyTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchKeyResultTypes[]>>;
};

function ContentKeyButton({
  keyId,
  keyText,
  limit,
  page,
  storyId,
  newElement,
  setEditingKey,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentKeyButtonTypes) {
  const removeKey = useDeleteKey({ storyId: storyId || "", page, limit });

  const handleRemove = ({ keyId }: { keyId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr._id !== keyId),
      }))
    );
    if ((newElement as KeyTypes)?._id === keyId) {
      setNewElement(null);
    }
    removeKey.mutate({ keyId });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button className="text-text flex-grow min-w-[75px] bg-accent text-[15px] p-[10px]">{keyText}</Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          className={``}
          onClick={() => {
            setStartEditing(true);
            setEditingKey({
              keyId,
              keyText: keyText || "",
            });
          }}
        >
          Изменить
        </ContextMenuItem>
        <ContextMenuItem className={``} onClick={() => handleRemove({ keyId })}>
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
