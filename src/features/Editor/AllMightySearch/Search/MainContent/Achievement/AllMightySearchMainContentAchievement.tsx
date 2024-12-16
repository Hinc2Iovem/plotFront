import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationAchievementTypes } from "../../../../../../types/Additional/TranslationTypes";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import useDeleteAchievement from "../../../../PlotField/hooks/Achievement/useDeleteAchievement";
import useGetAllTranslationAchievementByStoryId from "../../../../PlotField/hooks/Achievement/useGetAllTranslationAchievementByStoryId";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationAchievement, {
  AllMightySearchAchievementResultTypes,
} from "../../../hooks/useGetPaginatedTranslationAchievement";
import { EditingAchievementForm } from "./EditingAchievement";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type AllMightySearchMainContentAchievementTypes = {
  debouncedValue: string;
  newElement: TranslationAchievementTypes | null;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationAchievementTypes | null>>;
};

export type TempAchievementTypes = {
  achievementId: string;
  translatedAchievementId: string;
  text: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentAchievement({
  debouncedValue,
  currentCategory,
  newElement,
  setNewElement,
}: AllMightySearchMainContentAchievementTypes) {
  const { storyId } = useParams();
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedAchievements,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useGetPaginatedTranslationAchievement({
    language: "russian",
    limit: LIMIT,
    page: currentPage,
    storyId: storyId || "",
  });

  const { data: translatedAchievements } = useGetAllTranslationAchievementByStoryId({
    storyId: storyId || "",
    language: "russian",
    enabled: !!storyId && (status === "error" || status === "pending" || status === "success"),
  });

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchAchievementResultTypes[]>([]);
  const [startEditing, setStartEditing] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<TempAchievementTypes | null>(null);
  const [updatedAchievement, setUpdatedAchievement] = useState<TempAchievementTypes | null>(null);

  const memoizedAchievements = useMemo(() => {
    const res: TranslationAchievementTypes[] = [];
    if (translatedAchievements?.length) {
      const achievementArr = [...translatedAchievements];
      if (updatedAchievement) {
        const index = achievementArr.findIndex((k) => k._id === updatedAchievement.translatedAchievementId);
        const currentAchievement = achievementArr.find((k) => k._id === updatedAchievement.translatedAchievementId);
        const translations = currentAchievement?.translations?.map((r) => ({
          ...r,
          text: r.textFieldName === "achievementName" ? updatedAchievement.text : r.text,
        }));
        if (translations && typeof translations !== "undefined") {
          achievementArr[index].translations = translations;
        }
      }

      if (debouncedValue?.trim().length) {
        const newArr = translatedAchievements.filter((k) =>
          (k.translations || [])[0]?.text?.toLowerCase()?.includes(debouncedValue.toLowerCase())
        );
        res.push(...newArr);
      }
    }
    return res;
  }, [translatedAchievements, debouncedValue, updatedAchievement]);

  useEffect(() => {
    if (paginatedAchievements?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedAchievements.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedAchievements]);

  useEffect(() => {
    if (newElement !== null && newElement !== undefined && "achievementId" in newElement) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some(
            (p) => p.achievementId === (newElement as TranslationAchievementTypes).achievementId
          )
            ? [
                ...page.results,
                {
                  _id: "",
                  achievementId: newElement.achievementId,
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
                      textFieldName: TranslationTextFieldName.AchievementName as "achievementName",
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
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

  useEffect(() => {
    if (status === "error") {
      console.error("Achievement, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "achievement" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentAchievementButton
                    key={pr?.achievementId}
                    page={currentPage}
                    limit={LIMIT}
                    achievementId={pr.achievementId}
                    translationAchievementId={pr._id}
                    setEditingAchievement={setEditingAchievement}
                    setStartEditing={setStartEditing}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    achievementText={(pr.translations || [])[0]?.text}
                    newElement={newElement}
                    setNewElement={setNewElement}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedAchievements?.map((p) => (
                <ContentAchievementButton
                  key={p?.achievementId}
                  page={currentPage}
                  achievementId={p.achievementId}
                  limit={LIMIT}
                  translationAchievementId={p._id}
                  setEditingAchievement={setEditingAchievement}
                  setStartEditing={setStartEditing}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  achievementText={(p.translations || [])[0]?.text}
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
            ? "Больше ачивок нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
      </div>

      <EditingAchievementForm
        currentCategory={currentCategory}
        setAllPaginatedResults={setAllPaginatedResults}
        setStartEditing={setStartEditing}
        startEditing={startEditing}
        editingAchievement={editingAchievement}
        setUpdatedAchievement={setUpdatedAchievement}
      />
    </>
  );
}

type ContentAchievementButtonTypes = {
  achievementId: string;
  achievementText?: string;
  storyId: string;
  translationAchievementId: string;
  page: number;
  limit: number;
  newElement: TranslationAchievementTypes | null;
  setEditingAchievement: React.Dispatch<React.SetStateAction<TempAchievementTypes | null>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setNewElement: React.Dispatch<React.SetStateAction<TranslationAchievementTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchAchievementResultTypes[]>>;
};

function ContentAchievementButton({
  achievementId,
  achievementText,
  translationAchievementId,
  newElement,
  setEditingAchievement,
  setStartEditing,
  setNewElement,
  setAllPaginatedResults,
}: ContentAchievementButtonTypes) {
  const [suggestiveModal, setSuggestiveModal] = useState(false);
  const removeAchievement = useDeleteAchievement({});

  const modalRef = useRef<HTMLDivElement>(null);

  const handleRemove = ({ achievementId }: { achievementId: string }) => {
    setAllPaginatedResults((prev) =>
      prev.map((page) => ({
        ...page,
        results: page?.results.filter((pr) => pr.achievementId !== achievementId),
      }))
    );
    if ((newElement as TranslationAchievementTypes)?.achievementId === achievementId) {
      setNewElement(null);
    }
    removeAchievement.mutate({ bodyAchievementId: achievementId });
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
        {achievementText}
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
            setEditingAchievement({
              achievementId,
              text: achievementText || "",
              translatedAchievementId: translationAchievementId,
            });
          }}
        >
          Изменить
        </PlotfieldButton>
        <PlotfieldButton className={`bg-secondary text-[1.7rem]`} onClick={() => handleRemove({ achievementId })}>
          Удалить
        </PlotfieldButton>
      </div>
    </div>
  );
}
