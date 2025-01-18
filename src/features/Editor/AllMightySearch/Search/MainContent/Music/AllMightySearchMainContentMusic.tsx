import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MusicTypes } from "../../../../../../types/StoryData/Music/MusicTypes";
import useDeleteMusic from "../../../../PlotField/hooks/Music/useDeleteMusic";
import useGetAllMusicByStoryId from "../../../../PlotField/hooks/Music/useGetAllMusicByStoryId";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedMusic, { AllMightySearchMusicResultTypes } from "../../../hooks/useGetPaginatedMusic";
import LoadMoreButton from "../shared/LoadMoreButton";
import { EditingMusicForm } from "./EditingMusic";

type AllMightySearchMainContentMusicTypes = {
  debouncedValue: string;
  newElement: MusicTypes;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<MusicTypes | null>>;
};

export type TempMusicTypes = {
  musicId: string;
  musicText: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentMusic({
  debouncedValue,
  currentCategory,
  newElement,
  setNewElement,
}: AllMightySearchMainContentMusicTypes) {
  const { storyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchMusicResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingMusic, setEditingMusic] = useState<TempMusicTypes | null>(null);
  const [updatedMusic, setUpdatedMusic] = useState<TempMusicTypes | null>(null);

  const {
    data: paginatedMusic,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetPaginatedMusic({ limit: LIMIT, page: currentPage, storyId: storyId || "" });

  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId || "",
    enabled: !!storyId && !!allPaginatedResults && (status === "success" || status === "error" || status === "pending"),
  });

  const memoizedMusic = useMemo(() => {
    const res: MusicTypes[] = [];
    if (allMusic?.length) {
      const musicArr = [...allMusic];
      if (updatedMusic) {
        const index = musicArr.findIndex((k) => k._id === updatedMusic.musicId);
        musicArr[index].musicName = updatedMusic.musicText;
      }
      if (debouncedValue?.trim().length) {
        const newArr = allMusic.filter((k) => k.musicName?.toLowerCase()?.includes(debouncedValue.toLowerCase()));
        res.push(...newArr);
      }
    }
    return res;
  }, [allMusic, debouncedValue, updatedMusic]);

  // When new music added I'll need to add it to allPaginatedResults or slice the last array inside allPaginatedResults, I think I done it

  useEffect(() => {
    if (paginatedMusic?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedMusic.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedMusic]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined && "musicName" in newElement) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some((p) => p._id === (newElement as MusicTypes)._id)
            ? [...page.results, newElement as MusicTypes]
            : page?.results,
        }))
      );
    }
  }, [newElement]);

  useEffect(() => {
    if (status === "error") {
      console.error("Music, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "music" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[10px] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[10px] flex-wrap p-[10px]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentMusicButton
                    key={pr?._id}
                    page={currentPage}
                    limit={LIMIT}
                    musicId={pr._id}
                    setEditingMusic={setEditingMusic}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    musicText={pr.musicName}
                    newElement={newElement}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedMusic?.map((p) => (
                <ContentMusicButton
                  key={p?._id}
                  page={currentPage}
                  limit={LIMIT}
                  musicId={p._id}
                  setEditingMusic={setEditingMusic}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  musicText={p.musicName}
                  newElement={newElement}
                  setNewElement={setNewElement}
                />
              ))
            : null}
        </div>

        <LoadMoreButton<AllMightySearchMusicResultTypes>
          allPaginatedResults={allPaginatedResults}
          currentPage={currentPage}
          debouncedValue={debouncedValue}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setCurrentPage={setCurrentPage}
          type="музыки"
        />
      </div>

      <EditingMusicForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingMusic={editingMusic}
        setUpdatedMusic={setUpdatedMusic}
      />
    </>
  );
}

type ContentMusicButtonTypes = {
  musicId: string;
  musicText?: string;
  storyId: string;
  page: number;
  limit: number;
  newElement: MusicTypes;
  setEditingMusic: React.Dispatch<React.SetStateAction<TempMusicTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<MusicTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchMusicResultTypes[]>>;
};

function ContentMusicButton({
  musicId,
  musicText,
  storyId,
  newElement,
  setEditingMusic,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentMusicButtonTypes) {
  const removeMusic = useDeleteMusic({ storyId: storyId || "", musicId });

  const handleRemove = ({ musicId }: { musicId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr._id !== musicId),
      }))
    );
    if ((newElement as MusicTypes)?._id === musicId) {
      setNewElement(null);
    }
    removeMusic.mutate();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button className="text-text flex-grow min-w-[75px] bg-accent text-[15px] p-[10px]">{musicText}</Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setStartEditing(true);
            setEditingMusic({
              musicId,
              musicText: musicText || "",
            });
          }}
        >
          Изменить
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleRemove({ musicId })}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
