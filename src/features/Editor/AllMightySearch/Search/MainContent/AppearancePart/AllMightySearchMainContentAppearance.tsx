import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { appearancePartColors } from "../../../../../../const/APPEARACE_PARTS";
import useGetAppearancePartById from "../../../../../../hooks/Fetching/AppearancePart/useGetAppearancePartById";
import useGetTranslationAppearancePartsByStoryId from "../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../../types/Additional/TranslationTypes";
import { AppearancePartVariationRusTypes } from "../../../../../../types/StoryData/AppearancePart/AppearancePartTypes";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import PreviewImage from "../../../../../../ui/shared/PreviewImage";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useGetPaginatedTranslationAppearancePart, {
  AllMightySearchAppearancePartResultTypes,
} from "../../../hooks/useGetPaginatedTranslationAppearancePart";
import { EditingAppearancePartForm } from "./EditingAppearancePart";
import useUpdateImg from "../../../../../../hooks/Patching/useUpdateImg";
import useDeleteAppearancePart from "../../../../../../hooks/Deleting/Appearance/useDeleteAppearancePart";

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
  const { ref, inView } = useInView();
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
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

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
        } h-full flex flex-col gap-[1rem] overflow-auto | containerScroll`}
      >
        <div className="flex gap-[1rem] flex-wrap p-[1rem] justify-center">
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
            ? "Больше внешнего вида нету"
            : isFetchingNextPage
            ? "Загрузка"
            : "Смотреть Больше"}
        </button>
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
  const [typeToRus, setTypeToRus] = useState<AppearancePartVariationRusTypes>(
    type === "accessory"
      ? "украшение"
      : type === "art"
      ? "татуировка"
      : type === "body"
      ? "тело"
      : type === "dress"
      ? "внешний вид"
      : type === "hair"
      ? "волосы"
      : type === "temp"
      ? "остальное"
      : "кожа"
  );
  const [appearanceImg, setAppearanceImg] = useState(appearancePart?.img);
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);
  const [suggestiveModal, setSuggestiveModal] = useState(false);

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

  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (type) {
      setAppearanceType(type);
      setTypeToRus(
        type === "accessory"
          ? "украшение"
          : type === "art"
          ? "татуировка"
          : type === "body"
          ? "тело"
          : type === "dress"
          ? "внешний вид"
          : type === "hair"
          ? "волосы"
          : type === "temp"
          ? "остальное"
          : "кожа"
      );
    }
  }, [type]);

  useEffect(() => {
    if (
      updatedAppearancePart &&
      updatedAppearancePart.appearancePartId === appearanceId &&
      updatedAppearancePart.type !== type
    ) {
      setAppearanceType(updatedAppearancePart.type);
      setTypeToRus(
        updatedAppearancePart.type === "accessory"
          ? "украшение"
          : updatedAppearancePart.type === "art"
          ? "татуировка"
          : updatedAppearancePart.type === "body"
          ? "тело"
          : updatedAppearancePart.type === "dress"
          ? "внешний вид"
          : updatedAppearancePart.type === "hair"
          ? "волосы"
          : updatedAppearancePart.type === "temp"
          ? "остальное"
          : "кожа"
      );
    }
  }, [updatedAppearancePart, appearanceId, type]);

  const [isMounted, setIsMounted] = useState(false);

  const uploadImg = useUpdateImg({
    path: "/appearanceParts",
    preview: imagePreview,
    id: appearanceId,
  });

  useEffect(() => {
    if (imagePreview && isMounted) {
      uploadImg.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useOutOfModal({ setShowModal: setSuggestiveModal, showModal: suggestiveModal, modalRef });

  return (
    <div
      ref={modalRef}
      className="relative bg-primary-darker h-[35rem] flex-grow min-w-[20rem] md:max-w-[35rem] flex flex-col gap-[1rem] p-[.5rem]"
    >
      {appearanceImg ? (
        <img
          src={appearanceImg}
          alt={appearanceText}
          className="w-full h-[50%] absolute object-contain left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"
        />
      ) : (
        <PreviewImage
          imagePreview={imagePreview}
          setPreview={setImagePreview}
          imgClasses="w-full h-[50%] object-contain -translate-y-1/2 top-1/2 absolute"
        />
      )}

      <div className="absolute top-[.5rem] right-[.5rem] flex flex-col gap-[.5rem] p-[.5rem] text-right w-[calc(100%-1rem)]">
        <h3 className="text-[1.7rem] text-text-light bg-primary rounded-md px-[1rem] py-[.5rem]">{characterName}</h3>
        <p
          className={`text-[1.5rem] text-text-light ${appearancePartColors[typeToRus]} rounded-md w-fit ml-auto px-[1rem] py-[.5rem]`}
        >
          {typeToRus}
        </p>
      </div>

      <div className="relative mt-auto ">
        <h2
          onContextMenu={(e) => {
            e.preventDefault();
            setSuggestiveModal((prev) => !prev);
          }}
          className={`${
            suggestiveModal ? "bg-secondary" : "bg-primary"
          } text-[1.8rem] text-text-light rounded-md px-[1rem] py-[.5rem] transition-all hover:bg-secondary`}
        >
          {currentAppearanceText}
        </h2>

        <div
          className={`${
            suggestiveModal ? "" : "hidden"
          } flex flex-col gap-[1rem] bg-secondary p-[1rem] rounded-md shadow-sm shadow-dark-mid-gray absolute top-[4rem] w-fit right-[0rem] z-[10] `}
        >
          <PlotfieldButton
            className={`bg-secondary text-[1.7rem]`}
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
          </PlotfieldButton>
          <PlotfieldButton className={`bg-secondary text-[1.7rem]`} onClick={() => handleRemove({ appearanceId })}>
            Удалить
          </PlotfieldButton>
        </div>
      </div>
    </div>
  );
}
