import { useMemo, useRef } from "react";
import useGetTranslationAppearanceParts from "../../../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearanceParts";
import { PossibleWardrobeAppearancePartVariationsTypes } from "../../Wardrobe/WardrobeCharacterAppearancePartForm";
import PlotfieldAppearancePartsPrompt from "./PlotfieldAppearancePartPrompt";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { TranslationAppearancePartTypes } from "../../../../../../../types/Additional/TranslationTypes";

type PlotfieldAppearancePartPromptMainTypes = {
  setAppearancePartName?: React.Dispatch<React.SetStateAction<string>>;
  setAppearancePartId?: React.Dispatch<React.SetStateAction<string>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAppearancePartImg?: React.Dispatch<React.SetStateAction<string>>;
  showAppearancePartModal: boolean;
  characterId: string;
  appearancePartDebouncedValue: string;
  appearancePartVariationType: PossibleWardrobeAppearancePartVariationsTypes;
};

export default function PlotfieldAppearancePartPromptMain({
  setAppearancePartName,
  setAppearancePartId,
  setAppearancePartImg,
  setShowAppearancePartModal,
  showAppearancePartModal,
  characterId,
  appearancePartDebouncedValue,
  appearancePartVariationType,
}: PlotfieldAppearancePartPromptMainTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: allAppearanceParts } = useGetTranslationAppearanceParts({
    characterId: characterId ?? "",
    language: "russian",
  });

  const memoizedAppearanceParts = useMemo(() => {
    const filterByDebouncedValue = (items: TranslationAppearancePartTypes[]) =>
      appearancePartDebouncedValue?.trim().length
        ? (items || []).filter((r) =>
            r.translations[0]?.text
              .toLowerCase()
              .includes(appearancePartDebouncedValue.toLowerCase())
          )
        : items;

    if (appearancePartVariationType) {
      if (appearancePartVariationType === "dress") {
        return filterByDebouncedValue(
          allAppearanceParts?.filter((r) => r.type === "dress") || []
        );
      } else if (appearancePartVariationType === "hair") {
        return filterByDebouncedValue(
          allAppearanceParts?.filter((r) => r.type === "hair") || []
        );
      } else {
        return filterByDebouncedValue(
          allAppearanceParts?.filter(
            (r) => r.type !== "dress" && r.type !== "hair"
          ) || []
        );
      }
    } else {
      return filterByDebouncedValue(allAppearanceParts || []);
    }
  }, [
    allAppearanceParts,
    appearancePartVariationType,
    appearancePartDebouncedValue,
  ]);

  useOutOfModal({
    showModal: showAppearancePartModal,
    setShowModal: setShowAppearancePartModal,
    modalRef,
  });
  return (
    <aside
      ref={modalRef}
      className={`${
        showAppearancePartModal ? "" : "hidden"
      } translate-y-[.5rem] absolute z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
    >
      {memoizedAppearanceParts.length ? (
        memoizedAppearanceParts?.map((c) => (
          <PlotfieldAppearancePartsPrompt
            key={c._id}
            setAppearancePartName={setAppearancePartName}
            setAppearancePartId={setAppearancePartId}
            setAppearancePartImg={setAppearancePartImg}
            setShowAppearancePartModal={setShowAppearancePartModal}
            {...c}
          />
        ))
      ) : (
        <button
          type="button"
          className={`text-start outline-gray-300 text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md`}
        >
          Пусто
        </button>
      )}
    </aside>
  );
}
