import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import useGetMainCharacterByStoryId from "../../../../../../hooks/Fetching/Character/useGetMainCharacterByStoryId";
import useGetTranslationCharactersByType from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import { TranslationCharacterTypes } from "../../../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationCharacter, {
  AllMightySearchCharacterResultTypes,
} from "../../../hooks/useGetPaginatedTranslationCharacter";
import { NewElementTypes } from "../AllMightySearchMainContent";
import { CharacterEditingForm } from "./EditingCharacter";
import { ContentCharacterCard } from "./ContentCharacterCard";

type AllMightySearchMainContentCharacterTypes = {
  debouncedValue: string;
  newElement: NewElementTypes;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
};

export type EditingCharacterTypes = {
  characterId: string;
  name: string;
  unknownName?: string;
  description?: string;
  nameTag?: string;
  img?: string;
  characterType: CharacterTypes;
};

export type MainCharacterTypes = {
  characterId: string;
  characterName: string;
  characterImg?: string;
};

const LIMIT = 10;

export default function AllMightySearchMainContentCharacter({
  newElement,
  currentCategory,
  debouncedValue,
  setNewElement,
}: AllMightySearchMainContentCharacterTypes) {
  const { storyId } = useParams();
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);

  const [mainCharacterWasChanged, setMainCharacterWasChanged] = useState(false);
  const [updatedCharacter, setUpdatedCharacter] = useState<EditingCharacterTypes | null>(null);

  const [editingCharacter, setEditingCharacter] = useState<EditingCharacterTypes | null>(null);
  const [startEditing, setStartEditing] = useState(false);

  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchCharacterResultTypes[]>([]);

  const {
    data: paginatedCharacters,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetPaginatedTranslationCharacter({
    limit: LIMIT,
    page: currentPage,
    storyId: storyId || "",
    language: "russian",
  });

  const { data: translatedCharacter } = useGetTranslationCharactersByType({
    language: "russian",
    storyId: storyId || "",
    debouncedValue: "",
    characterType: "all",
    enabled: !!storyId && !!allPaginatedResults && (status === "success" || status === "error" || status === "pending"),
  });

  const { data: receivedMainCharacter } = useGetMainCharacterByStoryId({ language: "russian", storyId: storyId || "" });
  const [mainCharacter, setMainCharacter] = useState<MainCharacterTypes | null>(null);

  useEffect(() => {
    if (receivedMainCharacter) {
      setMainCharacter(receivedMainCharacter);
    }
  }, [receivedMainCharacter]);

  const memoizedCharacters = useMemo(() => {
    const res: TranslationCharacterTypes[] = [];
    if (translatedCharacter?.length) {
      const characterArr = [...translatedCharacter];
      if (updatedCharacter) {
        const index = characterArr.findIndex((k) => k.characterId === updatedCharacter.characterId);
        const currentCharacter = characterArr.find((k) => k.characterId === updatedCharacter.characterId);
        const translations = currentCharacter?.translations?.map((r) => ({
          ...r,
          text:
            r.textFieldName === "characterName"
              ? updatedCharacter.name
              : r.textFieldName === "characterDescription"
              ? updatedCharacter.description || r.text
              : updatedCharacter.unknownName || r.text,
        }));
        if (translations && typeof translations !== "undefined") {
          characterArr[index].translations = translations;
        }
      }

      if (debouncedValue?.trim().length) {
        const newArr = translatedCharacter.filter((k) =>
          (k.translations || [])[0]?.text?.toLowerCase()?.includes(debouncedValue.toLowerCase())
        );
        res.push(...newArr);
      }
    }
    return res;
  }, [translatedCharacter, debouncedValue, updatedCharacter]);

  useEffect(() => {
    if (paginatedCharacters?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedCharacters.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedCharacters]);

  useEffect(() => {
    if (
      newElement !== null &&
      newElement !== undefined &&
      "characterId" in newElement &&
      "characterType" in newElement
    ) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: !page?.results?.some((p) => p._id === newElement._id)
            ? [...page.results, newElement]
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
      console.error("Character, Error: ", error.message);
    }
  }, [status, error?.message]);

  return (
    <>
      <div
        className={`${currentCategory === "character" ? "" : "hidden"} ${
          startEditing ? "hidden" : ""
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem]">
          {!debouncedValue?.trim().length
            ? allPaginatedResults?.map((p) =>
                p?.results?.map((pr) => (
                  <ContentCharacterCard
                    key={pr?._id}
                    page={currentPage}
                    limit={LIMIT}
                    setMainCharacterWasChanged={setMainCharacterWasChanged}
                    mainCharacterWasChanged={mainCharacterWasChanged}
                    setEditingCharacter={setEditingCharacter}
                    setStartEditing={setStartEditing}
                    characterType={pr.characterType}
                    characterId={pr.characterId}
                    setAllPaginatedResults={setAllPaginatedResults}
                    storyId={storyId || ""}
                    characterText={(pr.translations || [])[0]?.text}
                    characterDescription={
                      pr.translations?.find((t) => t.textFieldName === "characterDescription")?.text || ""
                    }
                    characterUnknownName={
                      pr.translations?.find((t) => t.textFieldName === "characterUnknownName")?.text || ""
                    }
                    newElement={newElement}
                    setNewElement={setNewElement}
                    updatedCharacter={updatedCharacter}
                  />
                ))
              )
            : null}
          {debouncedValue?.trim().length
            ? memoizedCharacters?.map((p) => (
                <ContentCharacterCard
                  key={p?._id}
                  page={currentPage}
                  limit={LIMIT}
                  setMainCharacterWasChanged={setMainCharacterWasChanged}
                  mainCharacterWasChanged={mainCharacterWasChanged}
                  setEditingCharacter={setEditingCharacter}
                  setStartEditing={setStartEditing}
                  characterType={p.characterType}
                  characterId={p.characterId}
                  setAllPaginatedResults={setAllPaginatedResults}
                  storyId={storyId || ""}
                  characterText={(p.translations || [])[0]?.text}
                  characterDescription={
                    p.translations?.find((t) => t.textFieldName === "characterDescription")?.text || ""
                  }
                  characterUnknownName={
                    p.translations?.find((t) => t.textFieldName === "characterUnknownName")?.text || ""
                  }
                  newElement={newElement}
                  setNewElement={setNewElement}
                  updatedCharacter={updatedCharacter}
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
            ? "Больше персонажей нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
      </div>

      <CharacterEditingForm
        startEditing={startEditing}
        currentCategory={currentCategory}
        mainCharacter={mainCharacter}
        editingCharacter={editingCharacter}
        setStartEditing={setStartEditing}
        setMainCharacter={setMainCharacter}
        setUpdatedCharacter={setUpdatedCharacter}
        setMainCharacterWasChanged={setMainCharacterWasChanged}
        setAllPaginatedResults={setAllPaginatedResults}
      />
    </>
  );
}
export type FinedCharacteristicTypes = {
  _id: string;
  characteristicText: string;
  characteristicId: string;
};
