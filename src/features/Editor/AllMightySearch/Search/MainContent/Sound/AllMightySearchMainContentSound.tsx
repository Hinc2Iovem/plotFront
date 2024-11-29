import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useMemo, useRef } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useGetAllSoundByStoryId from "../../../../PlotField/hooks/Sound/useGetAllSoundsByStoryId";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useDeleteSound from "../../../../PlotField/hooks/Sound/useDeleteSound";
import useGetPaginatedSound, { AllMightySearchSoundResultTypes } from "../../../hooks/useGetPaginatedSounds";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { SoundTypes } from "../../../../../../types/StoryData/Sound/SoundTypes";
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
  const { ref, inView } = useInView();
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
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

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
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem]">
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
            ? "Больше звуков нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
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
  const [suggestiveModal, setSuggestiveModal] = useState(false);
  const removeSound = useDeleteSound({ storyId: storyId || "", soundId });

  const modalRef = useRef<HTMLDivElement>(null);

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
        {soundText}
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
            setEditingSound({
              soundId,
              soundText: soundText || "",
            });
          }}
        >
          Изменить
        </PlotfieldButton>
        <PlotfieldButton className={`bg-secondary text-[1.7rem]`} onClick={() => handleRemove({ soundId })}>
          Удалить
        </PlotfieldButton>
      </div>
    </div>
  );
}
