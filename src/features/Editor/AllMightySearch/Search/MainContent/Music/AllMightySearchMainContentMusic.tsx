import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { MusicTypes } from "../../../../../../types/StoryData/Music/MusicTypes";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import useDeleteMusic from "../../../../PlotField/hooks/Music/useDeleteMusic";
import useGetAllMusicByStoryId from "../../../../PlotField/hooks/Music/useGetAllMusicByStoryId";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedMusic, { AllMightySearchMusicResultTypes } from "../../../hooks/useGetPaginatedMusic";
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
  const { ref, inView } = useInView();
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
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

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
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem]">
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

        <button
          ref={ref}
          className={`${debouncedValue?.trim().length ? "hidden" : ""} ${
            !allPaginatedResults[allPaginatedResults.length - 1]?.next
              ? "bg-primary-darker text-dark-mid-gray"
              : "hover:text-text-light  focus-within:text-text-light text-text-light"
          } text-[1.8rem] mt-[2rem] ml-auto w-fit hover:bg-primary transition-all active:bg-primary-darker rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => {
            if (hasNextPage) {
              setCurrentPage((prev) => prev + 1);
              fetchNextPage();
            }
          }}
        >
          {!allPaginatedResults[allPaginatedResults.length - 1]?.next
            ? "Больше музыки нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
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
  const [suggestiveModal, setSuggestiveModal] = useState(false);
  const removeMusic = useDeleteMusic({ storyId: storyId || "", musicId });

  const modalRef = useRef<HTMLDivElement>(null);

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

  useOutOfModal({ setShowModal: setSuggestiveModal, showModal: suggestiveModal, modalRef });

  return (
    <div ref={modalRef} className="relative flex-grow min-w-[12rem]">
      <PlotfieldButton
        onContextMenu={(e) => {
          e.preventDefault();
          setSuggestiveModal((prev) => !prev);
        }}
        className="text-start w-full bg-primary-darker text-[1.5rem] p-[1rem]"
      >
        {musicText}
      </PlotfieldButton>

      <div
        className={`${
          suggestiveModal ? "" : "hidden"
        } flex flex-col gap-[1rem] bg-secondary p-[1rem] rounded-md shadow-sm shadow-dark-mid-gray absolute top-[4.5rem] w-fit right-[0rem] z-[10] `}
      >
        <PlotfieldButton
          className={`bg-secondary text-[1.7rem]`}
          onClick={() => {
            setStartEditing(true);
            setEditingMusic({
              musicId,
              musicText: musicText || "",
            });
          }}
        >
          Изменить
        </PlotfieldButton>
        <PlotfieldButton className={`bg-secondary text-[1.7rem]`} onClick={() => handleRemove({ musicId })}>
          Удалить
        </PlotfieldButton>
      </div>
    </div>
  );
}
