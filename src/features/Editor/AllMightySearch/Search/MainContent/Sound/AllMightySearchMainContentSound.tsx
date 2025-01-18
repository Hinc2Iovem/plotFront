import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SoundTypes } from "../../../../../../types/StoryData/Sound/SoundTypes";
import useDeleteSound from "../../../../PlotField/hooks/Sound/useDeleteSound";
import useGetAllSoundByStoryId from "../../../../PlotField/hooks/Sound/useGetAllSoundsByStoryId";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedSound, { AllMightySearchSoundResultTypes } from "../../../hooks/useGetPaginatedSounds";
import LoadMoreButton from "../shared/LoadMoreButton";
import { EditingSoundForm } from "./EditingSound";

type AllMightySearchMainContentSoundTypes = {
  debouncedValue: string;
  newElement: SoundTypes;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<SoundTypes | null>>;
};

export type TempSoundTypes = {
  soundId: string;
  soundText: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentSound({
  debouncedValue,
  currentCategory,
  newElement,
  setNewElement,
}: AllMightySearchMainContentSoundTypes) {
  const { storyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchSoundResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingSound, setEditingSound] = useState<TempSoundTypes | null>(null);
  const [updatedSound, setUpdatedSound] = useState<TempSoundTypes | null>(null);

  const {
    data: paginatedSound,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetPaginatedSound({ limit: LIMIT, page: currentPage, storyId: storyId || "" });

  const { data: allSound } = useGetAllSoundByStoryId({
    storyId: storyId || "",
    enabled: !!storyId && !!allPaginatedResults && (status === "success" || status === "error" || status === "pending"),
  });

  const memoizedSound = useMemo(() => {
    const res: SoundTypes[] = [];
    if (allSound?.length) {
      const soundArr = [...allSound];
      if (updatedSound) {
        const index = soundArr.findIndex((k) => k._id === updatedSound.soundId);
        soundArr[index].soundName = updatedSound.soundText;
      }
      if (debouncedValue?.trim().length) {
        const newArr = allSound.filter((k) => k.soundName?.toLowerCase()?.includes(debouncedValue.toLowerCase()));
        res.push(...newArr);
      }
    }
    return res;
  }, [allSound, debouncedValue, updatedSound]);

  // When new sound added I'll need to add it to allPaginatedResults or slice the last array inside allPaginatedResults, I think I done it

  useEffect(() => {
    if (paginatedSound?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedSound.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedSound]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined && "soundName" in newElement) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some((p) => p._id === (newElement as SoundTypes)._id)
            ? [...page.results, newElement as SoundTypes]
            : page?.results,
        }))
      );
    }
  }, [newElement]);

  useEffect(() => {
    if (status === "error") {
      console.error("Sound, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "sound" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[10px] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[10px] flex-wrap p-[10px]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentSoundButton
                    key={pr?._id}
                    page={currentPage}
                    limit={LIMIT}
                    soundId={pr._id}
                    setEditingSound={setEditingSound}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    soundText={pr.soundName}
                    newElement={newElement}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedSound?.map((p) => (
                <ContentSoundButton
                  key={p?._id}
                  page={currentPage}
                  limit={LIMIT}
                  soundId={p._id}
                  setEditingSound={setEditingSound}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  soundText={p.soundName}
                  newElement={newElement}
                  setNewElement={setNewElement}
                />
              ))
            : null}
        </div>

        <LoadMoreButton<AllMightySearchSoundResultTypes>
          allPaginatedResults={allPaginatedResults}
          currentPage={currentPage}
          debouncedValue={debouncedValue}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setCurrentPage={setCurrentPage}
          type="звуков"
        />
      </div>

      <EditingSoundForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingSound={editingSound}
        setUpdatedSound={setUpdatedSound}
      />
    </>
  );
}

type ContentSoundButtonTypes = {
  soundId: string;
  soundText?: string;
  storyId: string;
  page: number;
  limit: number;
  newElement: SoundTypes;
  setEditingSound: React.Dispatch<React.SetStateAction<TempSoundTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<SoundTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchSoundResultTypes[]>>;
};

function ContentSoundButton({
  soundId,
  soundText,
  storyId,
  newElement,
  setEditingSound,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentSoundButtonTypes) {
  const removeSound = useDeleteSound({ storyId: storyId || "", soundId });

  const handleRemove = ({ soundId }: { soundId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr._id !== soundId),
      }))
    );
    if ((newElement as SoundTypes)?._id === soundId) {
      setNewElement(null);
    }
    removeSound.mutate();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button className="text-text flex-grow min-w-[75px] bg-accent text-[15px] p-[10px]">{soundText}</Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setStartEditing(true);
            setEditingSound({
              soundId,
              soundText: soundText || "",
            });
          }}
        >
          Изменить
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleRemove({ soundId })}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
