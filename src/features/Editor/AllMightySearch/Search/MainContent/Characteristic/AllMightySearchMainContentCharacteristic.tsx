import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useRef, useState } from "react";
import { TranslationCharacterCharacteristicTypes } from "../../../../../../types/Additional/TranslationTypes";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationCharacteristic, {
  AllMightySearchCharacteristicResultTypes,
} from "../../../hooks/useGetPaginatedTranslationCharacteristic";
import useDeleteCharacteristic from "../../../../../../hooks/Deleting/Characteristic/useDeleteCharacteristic";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
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
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paginatedCharacteristics,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
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
      console.error("Characteristic, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "characteristic" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem]">
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
            ? "Больше характеристик нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
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
  const [suggestiveModal, setSuggestiveModal] = useState(false);
  const removeCharacteristic = useDeleteCharacteristic({
    characteristicId,
    currentLanguage: "russian",
    storyId: storyId || "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

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
        {characteristicText}
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
            setEditingCharacteristic({
              characteristicId,
              text: characteristicText || "",
              translatedCharacteristicId: translationCharacteristicId,
            });
          }}
        >
          Изменить
        </PlotfieldButton>
        <PlotfieldButton className={`bg-secondary text-[1.7rem]`} onClick={() => handleRemove({ characteristicId })}>
          Удалить
        </PlotfieldButton>
      </div>
    </div>
  );
}
