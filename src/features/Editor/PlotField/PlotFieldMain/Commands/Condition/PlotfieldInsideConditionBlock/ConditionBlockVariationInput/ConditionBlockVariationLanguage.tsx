import { useRef, useState } from "react";
import {
  ALL_LANGUAGES,
  CurrentlyAvailableLanguagesTypes,
} from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionLanguage from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionLanguage";

type ConditionBlockVariationLanguageTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes | null;
  conditionBlockId: string;
  conditionBlockVariationId: string;
  plotfieldCommandId: string;
};

export default function ConditionBlockVariationLanguage({
  currentLanguage,
  conditionBlockId,
  conditionBlockVariationId,
  plotfieldCommandId,
}: ConditionBlockVariationLanguageTypes) {
  const [language, setLanguage] = useState(typeof currentLanguage === "string" ? currentLanguage : "");
  const [showAllLangauges, setShowAllLanguages] = useState(false);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const languageModalRef = useRef<HTMLDivElement>(null);

  const updateConditionLanguage = useUpdateConditionLanguage({ conditionBlockLanguageId: conditionBlockVariationId });

  useOutOfModal({
    modalRef: languageModalRef,
    setShowModal: setShowAllLanguages,
    showModal: showAllLangauges,
  });
  return (
    <div className="relative">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllLanguages((prev) => !prev);
        }}
        type="button"
        className={` bg-primary-darker hover:bg-primary transition-colors text-text-light w-full`}
      >
        {language?.trim().length ? language : "Язык"}
      </PlotfieldButton>

      <AsideScrollable
        ref={languageModalRef}
        className={`${showAllLangauges ? "" : "hidden"} translate-y-[.5rem] z-[10]`}
      >
        {ALL_LANGUAGES.map((l) => (
          <AsideScrollableButton
            onClick={() => {
              setLanguage(l);
              setShowAllLanguages(false);
              updateConditionBlockVariationValue({
                conditionBlockId,
                conditionBlockVariationId,
                plotfieldCommandId,
                currentLanguage: l,
              });

              updateConditionLanguage.mutate({ language: l });
            }}
            type="button"
          >
            {l}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    </div>
  );
}
